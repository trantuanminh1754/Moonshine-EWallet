import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    const navigation = useNavigation();

    const handleLogin = async (role: 'user' | 'admin') => {
        await login(role);
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('Home' as never);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Left Back Button (Continue as Guest equivalent) */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Moonshine</Text>
                <Text style={styles.subtitle}>E-Entry Wallet</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.userButton]}
                        onPress={() => handleLogin('user')}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>Log In as User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.adminButton]}
                        onPress={() => handleLogin('admin')}
                        disabled={isLoading}
                    >
                        <Text style={styles.adminText}>Admin Access</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 8,
        marginLeft: -8, // Align nicely with content padding
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80, // Offset to center visually roughly around middle
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 60,
        letterSpacing: 2,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    userButton: {
        backgroundColor: '#000',
    },
    adminButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    adminText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    }
});
