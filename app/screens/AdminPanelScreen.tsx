import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface MockUser {
    id: string;
    username: string;
    entries: number;
}

const INITIAL_USERS: MockUser[] = [
    { id: 'u123', username: 'Johnny Silverhand', entries: 5 },
    { id: 'u124', username: 'V', entries: 2 },
    { id: 'u125', username: 'David Martinez', entries: 0 },
    { id: 'u126', username: 'Lucy', entries: 10 },
    { id: 'u127', username: 'Rebecca', entries: 3 },
    { id: 'u128', username: 'Maine', entries: 1 },
];

export default function AdminPanelScreen() {
    const navigation = useNavigation();
    const [users, setUsers] = useState(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
    const [newEntryCount, setNewEntryCount] = useState('');

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openManageModal = (user: MockUser) => {
        setSelectedUser(user);
        setNewEntryCount(user.entries.toString());
        setModalVisible(true);
    };

    const saveEntries = () => {
        if (!selectedUser) return;
        const count = parseInt(newEntryCount);
        if (isNaN(count)) {
            Alert.alert("Error", "Please enter a valid number");
            return;
        }

        setUsers(prev => prev.map(u =>
            u.id === selectedUser.id ? { ...u, entries: count } : u
        ));
        setModalVisible(false);
    };

    const incrementEntries = () => {
        const current = parseInt(newEntryCount) || 0;
        setNewEntryCount((current + 1).toString());
    };

    const decrementEntries = () => {
        const current = parseInt(newEntryCount) || 0;
        if (current > 0) {
            setNewEntryCount((current - 1).toString());
        }
    };

    const renderItem = ({ item }: { item: MockUser }) => (
        <View style={styles.userRow}>
            <View style={styles.userInfo}>
                <Ionicons name="person" size={32} color="#888" style={{ marginRight: 10 }} />
                <View>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.entries}>Entries: <Text style={styles.entriesValue}>{item.entries}</Text></Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.manageButton}
                onPress={() => openManageModal(item)}
            >
                <Ionicons name="settings-outline" size={16} color="#fff" />
                <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Admin Panel</Text>
                <View style={{ width: 60 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No users found.</Text>
                }
            />

            {/* Edit Entries Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Manage Entries</Text>
                        <Text style={styles.modalSubtitle}>User: {selectedUser?.username}</Text>

                        <Text style={styles.label}>Set Total Entries:</Text>

                        <View style={styles.inputRow}>
                            <TouchableOpacity onPress={decrementEntries} style={styles.counterButton}>
                                <Ionicons name="remove" size={24} color="#000" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={newEntryCount}
                                onChangeText={setNewEntryCount}
                                textAlign="center"
                                selectTextOnFocus={true}
                            />

                            <TouchableOpacity onPress={incrementEntries} style={styles.counterButton}>
                                <Ionicons name="add" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={saveEntries}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
        marginLeft: 4,
    },
    title: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        height: '100%',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        // Shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    entries: {
        color: '#666',
        marginTop: 2,
        fontSize: 13,
    },
    entriesValue: {
        color: '#000',
        fontWeight: 'bold',
    },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF', // Blue for Manage
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    manageButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        alignSelf: 'center', // Center label too
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content
        gap: 16,
        marginBottom: 24,
    },
    counterButton: {
        backgroundColor: '#f0f0f0',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 24, // Bigger font for number
        fontWeight: 'bold',
        backgroundColor: '#f9f9f9',
        width: 80, // Fixed width for number
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
