import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import UserCard from '../components/UserCard';
import FeedList from '../components/FeedList';
import { RSSService, FeedItem } from '../services/RSSService';

export default function HomeScreen() {
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(false);

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        setLoadingFeed(true);
        const items = await RSSService.fetchFeed();
        setFeedItems(items);
        setLoadingFeed(false);
    };

    const checkGuestData = () => {
        if (!user) {
            navigation.navigate('Login');
            return false;
        }
        return true;
    };

    const handleShowQR = () => {
        if (user?.role === 'admin') {
            navigation.navigate('Scanner');
            return;
        }
        if (checkGuestData()) {
            navigation.navigate('QR');
        }
    };

    const handleTopUp = () => {
        if (checkGuestData()) {
            Alert.alert("Top Up Request", "Simulating payment gateway...\n\nRequest sent to Admin.");
        }
    };

    const handleAdminPanel = () => {
        if (checkGuestData()) {
            navigation.navigate('AdminPanel');
        }
    };

    const handleSignAction = () => {
        if (user) {
            logout();
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Moonshine</Text>

                {user ? (
                    <TouchableOpacity style={[styles.pillButton, styles.logoutButton]} onPress={handleSignAction}>
                        <View style={styles.iconRow}>
                            <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.pillButton, styles.loginButton]} onPress={handleSignAction}>
                        <View style={styles.iconRow}>
                            <Ionicons name="log-in-outline" size={18} color="#fff" />
                            <Text style={styles.loginText}>Log In</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <UserCard
                    user={user}
                    onShowQR={handleShowQR}
                    onTopUp={handleTopUp}
                    onAdminPanel={handleAdminPanel}
                />

                <Text style={styles.sectionTitle}>Latest Updates</Text>
                <View style={{ flex: 1 }}>
                    <FeedList
                        items={feedItems}
                        refreshing={loadingFeed}
                        onRefresh={loadFeed}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        letterSpacing: -0.5,
    },
    pillButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    loginButton: {
        backgroundColor: '#007AFF',
    },
    loginText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FF3B30',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        color: '#000',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
    },
    emptyFeed: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyFeedText: {
        color: '#666',
    }
});
