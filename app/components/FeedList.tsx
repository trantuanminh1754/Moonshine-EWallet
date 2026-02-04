import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { FeedItem } from '../services/RSSService';

interface FeedListProps {
    items: FeedItem[];
    refreshing?: boolean;
    onRefresh?: () => void;
}

export default function FeedList({ items, refreshing, onRefresh }: FeedListProps) {
    const handlePress = (link: string) => {
        Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
    };

    const renderItem = ({ item }: { item: FeedItem }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item.link)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{new Date(item.pubDate).toLocaleDateString()}</Text>
            {item.contentSnippet && (
                <Text style={styles.snippet} numberOfLines={2}>
                    {item.contentSnippet}
                </Text>
            )}
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            onRefresh={onRefresh}
            refreshing={!!refreshing}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        // Modern card look
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    snippet: {
        fontSize: 14,
        color: '#555',
    },
});
