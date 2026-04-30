import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/wifi.module.css';

const NETWORK_PREFIXES = ['Aurora', 'Atlas', 'Nova', 'Orion', 'Cobalt', 'Vertex', 'Ember', 'Signal', 'Orbit', 'Zenith'];
const NETWORK_SUFFIXES = ['Home', 'Guest', 'Office', 'Lab', 'Link', 'Mesh', 'Spot', 'Net', 'Wave', 'Hub'];
const USED_IDS = new Set();

function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function getRandomNetworkName() {
    return `${getRandomItem(NETWORK_PREFIXES)} ${getRandomItem(NETWORK_SUFFIXES)}`;
}

function getRandomNumericId() {
    let id = Math.floor(1000 + Math.random() * 9000);

    while (USED_IDS.has(id)) {
        id = Math.floor(1000 + Math.random() * 9000);
    }

    USED_IDS.add(id);
    return id;
}

function buildFakeNetworks() {
    const networkCount = Math.floor(Math.random() * 6);
    const networks = [];

    for (let index = 0; index < networkCount; index += 1) {
        networks.push({
            id: getRandomNumericId(),
            name: getRandomNetworkName(),
            secure: Math.random() >= 0.35,
            signalLevel: Math.floor(Math.random() * 4),
            channel: 1 + Math.floor(Math.random() * 11),
        });
    }

    return networks;
}

function getSignalIcon(signalLevel) {
    if (signalLevel == null || signalLevel < 0) {
        return '/NoWifi.svg';
    }

    if (signalLevel === 0) {
        return '/Wifi_0.svg';
    }

    if (signalLevel === 1) {
        return '/Wifi_1.svg';
    }

    if (signalLevel === 2) {
        return '/Wifi_2.svg';
    }

    return '/Wifi_3.svg';
}

export default function WifiPanel({ isOpen, onClose, triggerRef, onSignalChange }) {
    const [lastCheckedAt, setLastCheckedAt] = useState(new Date());
    const [isScanning, setIsScanning] = useState(false);
    const [networks, setNetworks] = useState([]);
    const [connectedNetwork, setConnectedNetwork] = useState(null);
    const [connectingNetworkId, setConnectingNetworkId] = useState(null);
    const panelRef = useRef(null);
    const scanTimeoutRef = useRef(null);
    const connectTimeoutRef = useRef(null);

    function clearPendingTimers() {
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current = null;
        }

        if (connectTimeoutRef.current) {
            clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
        }
    }

    function finishScan() {
        const nextNetworks = buildFakeNetworks();

        if (connectedNetwork) {
            const exists = nextNetworks.some((n) => n.id === connectedNetwork.id);

            if (!exists) {
                nextNetworks.unshift({
                    id: connectedNetwork.id,
                    name: connectedNetwork.name,
                    secure: connectedNetwork.secure ?? true,
                    signalLevel: connectedNetwork.signalLevel ?? 3,
                    channel: connectedNetwork.channel ?? 1,
                });
            }
        }

        setNetworks(nextNetworks);
        setIsScanning(false);
        setLastCheckedAt(new Date());
    }

    function handleRefresh() {
        clearPendingTimers();
        setConnectingNetworkId(null);
        setIsScanning(true);

        scanTimeoutRef.current = setTimeout(() => {
            finishScan();
        }, 700);
    }

    function handleConnect(network) {
        clearPendingTimers();
        setConnectingNetworkId(network.id);

        connectTimeoutRef.current = setTimeout(() => {
            setConnectingNetworkId(null);
            setConnectedNetwork({ ...network });
            onSignalChange?.(network.signalLevel, network.name);
        }, 650);
    }

    function handleDisconnect() {
        clearPendingTimers();
        setConnectedNetwork(null);
        setConnectingNetworkId(null);
        onSignalChange?.(null, null);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            const isClickOnPanel = panelRef.current && panelRef.current.contains(event.target);
            const isClickOnTrigger = triggerRef?.current && triggerRef.current.contains(event.target);

            if (!isClickOnPanel && !isClickOnTrigger) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onClose, triggerRef]);

    useEffect(() => {
        if (isOpen && networks.length === 0 && !isScanning) {
            handleRefresh();
        }
    }, [isOpen, networks.length, isScanning]);

    useEffect(() => {
        return () => {
            clearPendingTimers();
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.wifiContainer} ref={panelRef}>
            <div className={styles.header}>
                <div className={styles.title}>Wi-Fi</div>
                <span className={styles.status}>
                    {isScanning ? 'Searching...' : connectedNetwork ? 'Connected' : `${networks.length} networks found`}
                </span>
            </div>

            {isScanning ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>⋯</div>
                    <div className={styles.emptyText}>
                        <strong>Scanning for networks</strong>
                        <span>Looking for nearby wireless networks.</span>
                    </div>
                </div>
            ) : networks.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>◌</div>
                    <div className={styles.emptyText}>
                        <strong>No networks found</strong>
                        <span>The device cannot detect any nearby wireless networks.</span>
                    </div>
                </div>
            ) : (
                <div className={styles.networkList}>
                    {networks.map((network) => {
                        const isConnected = connectedNetwork?.id === network.id;
                        const isConnecting = connectingNetworkId === network.id;

                        return (
                            <div key={network.id} className={`${styles.networkRow} ${isConnected ? styles.networkRowConnected : ''}`}>
                                <div className={styles.networkInfo}>
                                    <div className={styles.networkTopLine}>
                                        <span className={styles.networkName}>{network.name}</span>
                                        <span className={styles.signalIcon} title={`${network.signalLevel}/3 bars`}>
                                            <img
                                                src={getSignalIcon(network.signalLevel)}
                                                alt={`${network.signalLevel}/3`}
                                                className={styles.signalImg}
                                                aria-hidden='true'
                                            />
                                        </span>
                                    </div>
                                    <div className={styles.networkMeta}>
                                        {network.secure ? 'Secure network' : 'Open network'} · Channel {network.channel}
                                    </div>
                                </div>

                                <button
                                    type='button'
                                    className={isConnected ? styles.disconnectButton : styles.connectButton}
                                    onClick={() => (isConnected ? handleDisconnect() : handleConnect(network))}
                                    disabled={isConnecting}
                                >
                                    {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.footer}>
                <div className={styles.lastChecked}>
                    Last checked {lastCheckedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button onClick={handleRefresh} className={styles.refreshButton} type='button'>
                    Refresh
                </button>
            </div>
        </div>
    );
}