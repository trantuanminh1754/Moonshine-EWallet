import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../services/AuthService';

interface UserCardProps {
    user: User | null;
    onShowQR?: () => void;
    onTopUp?: () => void;
    onAdminPanel?: () => void;
}

export default function UserCard({ user, onShowQR, onTopUp, onAdminPanel }: UserCardProps) {
    const isGuest = !user;
    const isUser = user?.role === 'user';
    const isAdmin = user?.role === 'admin';

    const displayUser = user || {
        username: 'Guest',
        entries: 0,
        role: 'guest',
    };

    return (
        <View style={styles.card}>
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={60} color="#555" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.username}>{displayUser.username}</Text>

                    {!isGuest && isUser && (
                        <Text style={styles.entries}>
                            Entries: <Text style={styles.entriesValue}>{displayUser.entries}</Text>
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={onShowQR}>
                    <View style={styles.iconRow}>
                        <Ionicons name={isAdmin ? "scan-outline" : "qr-code-outline"} size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>{isAdmin ? "Scan QR" : "Show QR"}</Text>
                    </View>
                </TouchableOpacity>

                {!isAdmin ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={onTopUp}
                    >
                        <View style={styles.iconRow}>
                            <Ionicons name="cash-outline" size={20} color="#000" />
                            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Top Up</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.adminButton]}
                        onPress={onAdminPanel}
                    >
                        <View style={styles.iconRow}>
                            <Ionicons name="settings-outline" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Admin Panel</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        marginRight: 16,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    username: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },

    entries: {
        color: '#666',
        marginTop: 6,
        fontSize: 14,
    },
    entriesValue: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#000',
    },
    secondaryButtonText: {
        color: '#000',
    },
    adminButton: {
        backgroundColor: '#D32F2F',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    }
});
