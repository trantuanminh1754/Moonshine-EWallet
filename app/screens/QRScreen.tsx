import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function QRScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [qrValue, setQrValue] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (!user) return;

        const generateQR = () => {
            const payload = {
                userId: user.id,
                timestamp: Date.now(),
                // mock signature
                sig: Math.random().toString(36).substring(7),
            };
            setQrValue(JSON.stringify(payload));
            setTimeLeft(30);
        };

        generateQR();

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    generateQR();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Entry Ticket</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.qrContainer}>
                    {qrValue ? (
                        <QRCode
                            value={qrValue}
                            size={SCREEN_WIDTH * 0.7}
                            backgroundColor="white"
                            color="black"
                        />
                    ) : (
                        <Text style={{ color: '#000' }}>Generating...</Text>
                    )}
                </View>
                <Text style={styles.helperText}>Show this to the validator</Text>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Refreshing in</Text>
                    <Text style={styles.timerValue}>{timeLeft}s</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Light BG
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        color: '#007AFF', // Blue
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        // Add shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    helperText: {
        color: '#666',
        fontSize: 16,
        marginBottom: 40,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerLabel: {
        color: '#888',
        fontSize: 14,
        marginBottom: 4,
    },
    timerValue: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    }
});
