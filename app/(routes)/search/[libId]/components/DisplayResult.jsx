'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AnswerDisplay from './AnswerDisplay';
import { supabase } from "@/services/supabase";
import { useUser } from '@clerk/nextjs';
import {
Sparkles as LucideSparkles,
Image as LucideImage,
Video as LucideVideo,
List as LucideList,
Send
} from 'lucide-react';

const tabs = [
{ label: 'Answer', icon: LucideSparkles },
//{ label: 'Images', icon: LucideImage },
//{ label: 'Videos', icon: LucideVideo },
//{ label: 'Sources', icon: LucideList, badge: 10 },
];

function DisplayResult({ searchInputRecord }) {

const [activeTab, setActiveTab] = useState('Answer');
const [answer, setAnswer] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [messages, setMessages] = useState([]);
const [newQuestion, setNewQuestion] = useState('');
const { user } = useUser();
 const email = user?.primaryEmailAddress?.emailAddress;
const searchInput = searchInputRecord?.searchInput;
const searchType = searchInputRecord?.type;
const chatId = searchInputRecord?.libId;

// Generate AI Answer
const GetSearchApiResult = async (question, history) => {

    const result = await axios.post(
        '/api/google-search-api',
        {
            searchInput: question,
            searchType,
            conversationHistory: history
        }
    );

    if (!result.data.success) {
        throw new Error(result.data.error || 'Something went wrong');
    }

    return result.data.answer;
};

// Save Message in Supabase
const SaveMessage = async (role, content) => {

    const { data, error } = await supabase
        .from('Message')
        .insert([
            {
                chatId: chatId,
                role: role,
                content: content,
                email:email
            }
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

// Load Previous Conversation
useEffect(() => {

    if (!chatId || !searchInput) return;

    let isMounted = true;

    const GetSearchApiResultInitial = async () => {

        try {

            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('Message')
                .select('*')
                .eq('chatId', chatId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!isMounted) return;

            if (data && data.length > 0) {

                setMessages(data);

                const lastAnswer = [...data]
                    .reverse()
                    .find(message => message.role === 'assistant');

                if (lastAnswer) {
                    setAnswer(lastAnswer.content);
                }

            } else {

                // First Question
                const userMessage = await SaveMessage(
                    'user',
                    searchInput
                );

                if (!isMounted) return;

                setMessages([userMessage]);

                const aiAnswer = await GetSearchApiResult(
                    searchInput,
                    []
                );

                const assistantMessage = await SaveMessage(
                    'assistant',
                    aiAnswer
                );

                if (!isMounted) return;

                setMessages([
                    userMessage,
                    assistantMessage
                ]);

                setAnswer(aiAnswer);
            }

        } catch (error) {

            console.error('API ERROR:', error);
            console.error('ERROR MESSAGE:', error.message);
            console.error('ERROR DETAILS:', error.details);
            console.error('ERROR HINT:', error.hint);
            console.error('ERROR RESPONSE:', error.response?.data);

            if (isMounted) {
                setError(
                    error.response?.data?.error ||
                    error.message ||
                    error.details ||
                    error.hint ||
                    'Failed to generate answer'
                );
            }

        } finally {

            if (isMounted) {
                setLoading(false);
            }

        }
    };

    GetSearchApiResultInitial();

    return () => {
        isMounted = false;
    };

}, [chatId, searchInput]);


// Send New Question
const onSendMessage = async () => {

    if (!newQuestion.trim() || loading || !chatId) return;

    const question = newQuestion.trim();

    try {

        setLoading(true);
        setError('');
        setNewQuestion('');

        // Save User Question
        const userMessage = await SaveMessage(
            'user',
            question
        );

        const updatedMessages = [
            ...messages,
            userMessage
        ];

        setMessages(updatedMessages);

        // Previous Conversation History
        const conversationHistory = messages.map(message => ({
            role: message.role,
            content: message.content
        }));

        // Generate AI Answer
        const aiAnswer = await GetSearchApiResult(
            question,
            conversationHistory
        );

        // Save AI Answer
        const assistantMessage = await SaveMessage(
            'assistant',
            aiAnswer
        );

        setMessages([
            ...updatedMessages,
            assistantMessage
        ]);

        setAnswer(aiAnswer);

    } catch (error) {

        console.error('API ERROR:', error);
        console.error('ERROR MESSAGE:', error.message);
        console.error('ERROR DETAILS:', error.details);
        console.error('ERROR HINT:', error.hint);
        console.error('ERROR RESPONSE:', error.response?.data);

        setError(
            error.response?.data?.error ||
            error.message ||
            error.details ||
            error.hint ||
            'Failed to generate answer'
        );

    } finally {

        setLoading(false);

    }
};


return (
    <div className="mt-7">


       <div className="sticky top-[69px] z-40 bg-white flex items-center space-x-6 border-b border-gray-200 pb-2 mt-0">
            {tabs.map(({ label, icon: Icon, badge }) => (

                <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${
                        activeTab === label ? 'text-black' : ''
                    }`}
                >

                    <Icon className="w-4 h-4" />

                    <span>{label}</span>

                    {badge && (
                        <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {badge}
                        </span>
                    )}

                    {activeTab === label && (
                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                    )}

                </button>

            ))}

            <div className="ml-auto text-sm text-gray-500">
                {messages.length} messages
            </div>

        </div>

        <div className="mt-5 pb-32">

            {activeTab === 'Answer' && (

                <>

                    {messages.map((message) => (

                        <div
                            key={message.id}
                            className="mb-6"
                        >

                            {message.role === 'user' ? (

                                <div className="flex justify-end">
                                    <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                                        {message.content}
                                    </div>
                                </div>

                            ) : (

                                <AnswerDisplay answer={message.content} />

                            )}

                        </div>

                    ))}

                    {loading && (
                        <p className="text-gray-500">
                            Generating answer...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-500">
                            {error}
                        </p>
                    )}

                </>

            )}

        </div>

        {activeTab === 'Answer' && (

            <div className="sticky bottom-4 bg-white border border-gray-300 rounded-2xl p-3 shadow-lg">

                <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSendMessage();
                        }
                    }}
                    placeholder="Ask a follow-up question..."
                    className="w-full resize-none outline-none p-2"
                    rows={2}
                    disabled={loading}
                />

                <div className="flex justify-end">

                    <button
                        onClick={onSendMessage}
                        disabled={loading || !newQuestion.trim()}
                        className="bg-black text-white p-3 rounded-xl disabled:opacity-40"
                    >
                        <Send className="w-4 h-4" />
                    </button>

                </div>

            </div>

        )}

    </div>
);


}

export default DisplayResult;
