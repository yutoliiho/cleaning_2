import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { commonStyles } from '../styles/commonStyles';
import { BookingData, Cleaner } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'cleaner';
  timestamp: Date;
  translatedText?: string;
  isTranslated?: boolean;
  isVoiceMessage?: boolean;
}

interface BookingDetailPageProps {
  bookingData: BookingData;
  cleaners: Cleaner[];
  onBack?: () => void;
}

type TabType = 'receipt' | 'taskInfo' | 'chat';

export const BookingDetailPage: React.FC<BookingDetailPageProps> = ({
  bookingData,
  cleaners,
  onBack
}) => {
  const selectedCleaner = cleaners.find(c => c.id === bookingData.selectedCleaner);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<ScrollView>(null);
  const [translatedMessages, setTranslatedMessages] = useState<{[key: string]: boolean}>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // User's default language preference (this could come from settings/context)
  const [defaultLanguage, setDefaultLanguage] = useState('Chinese');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m looking forward to cleaning your home. I\'ll arrive right on time and bring all necessary supplies.',
      sender: 'cleaner',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      translatedText: '你好！我期待着清洁您的家。我会准时到达并带上所有必要的用品。'
    },
    {
      id: '2',
      text: 'Great! Please note that I have a dog, so please be careful when entering.',
      sender: 'user',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      translatedText: '太好了！请注意我有一只狗，所以进入时请小心。'
    },
    {
      id: '3',
      text: 'No problem at all! I love pets. I\'ll make sure to be extra careful and gentle around your dog.',
      sender: 'cleaner',
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      translatedText: '完全没问题！我喜欢宠物。我会确保在您的狗周围格外小心和温柔。'
    },
    {
      id: '4',
      text: 'Hi! I\'m looking forward to cleaning your home. I\'ll arrive right on time and bring all necessary supplies.',
      sender: 'cleaner',
      timestamp: new Date(Date.now() - 18 * 60 * 1000), // 30 minutes ago
      translatedText: '你好！我期待着清洁您的家。我会准时到达并带上所有必要的用品。'
    },
    {
      id: '5',
      text: 'Great! Please note that I have a dog, so please be careful when entering.',
      sender: 'user',
      timestamp: new Date(Date.now() - 17.8 * 60 * 1000), // 25 minutes ago
      translatedText: '太好了！请注意我有一只狗，所以进入时请小心。'
    },
    {
      id: '6',
      text: 'No problem at all! I love pets. I\'ll make sure to be extra careful and gentle around your dog.',
      sender: 'cleaner',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 20 minutes ago
      translatedText: '完全没问题！我喜欢宠物。我会确保在您的狗周围格外小心和温柔。'
    }
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current?.scrollToEnd({ animated: false });
    }
  }, [messages]);

  // Auto-scroll to bottom when chat tab is opened
  useEffect(() => {
    if (activeTab === 'chat' && messagesContainerRef.current) {
      messagesContainerRef.current?.scrollToEnd({ animated: false });
    }
  }, [activeTab]);

  if (!selectedCleaner) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (hour: string, minute: string) => {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minuteNum.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date(),
        translatedText: `[Translated: ${newMessage.trim()}]` // Placeholder translation
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom after sending message
      if (messagesContainerRef.current) {
        messagesContainerRef.current?.scrollToEnd({ animated: false });
      }
    }
  };

  const toggleTranslation = (messageId: string) => {
    setTranslatedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingDuration(0);
    
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // Store timer reference for cleanup
    (global as any).recordingTimer = timer;
    
    console.log('Started voice recording...');
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecordingDuration(0);
    
    // Clear timer
    if ((global as any).recordingTimer) {
      clearInterval((global as any).recordingTimer);
      (global as any).recordingTimer = null;
    }
    
    // Simulate voice-to-text conversion
    const voiceText = "This is a voice message converted to text";
    const translatedVoiceText = "这是转换为文本的语音消息";
    
    // Create voice message
    const message: Message = {
      id: Date.now().toString(),
      text: voiceText,
      sender: 'user',
      timestamp: new Date(),
      translatedText: translatedVoiceText,
      isVoiceMessage: true
    };
    
    setMessages(prev => [...prev, message]);
    
    // Scroll to bottom after sending voice message
    if (messagesContainerRef.current) {
      messagesContainerRef.current?.scrollToEnd({ animated: false });
    }
    
    console.log('Voice recording stopped and converted to text');
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBookingTimeDisplay = () => {
    if (bookingData.timing === 'scheduled' && bookingData.selectedDate && bookingData.selectedHour && bookingData.selectedMinute) {
      return `${formatDate(bookingData.selectedDate)} at ${formatTime(bookingData.selectedHour, bookingData.selectedMinute)}`;
    } else if (bookingData.timing === 'asap' && bookingData.selectedTimeSlot) {
      return `ASAP - ${bookingData.selectedTimeSlot}`;
    }
    return 'Time TBD';
  };

  const hourlyRate = 35;
  const hours = parseInt(bookingData.bookingHours) || 2;
  const subtotal = hours * hourlyRate;
  const trustSupportFee = Math.round(subtotal * 0.075 * 100) / 100; // 7.5% fee
  const expenses = 0;
  const total = subtotal + trustSupportFee + expenses;

  const renderReceiptTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Cleaner</Text>
        <Text style={styles.receiptValue}>{selectedCleaner?.name}</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Date of Task</Text>
        <Text style={styles.receiptValue}>{getBookingTimeDisplay()}</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Rate</Text>
        <Text style={styles.receiptValue}>${hourlyRate}/hr</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Hours</Text>
        <Text style={styles.receiptValue}>{hours}:00</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Trust & Support Fee</Text>
        <Text style={styles.receiptValue}>${trustSupportFee.toFixed(2)}</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={styles.receiptLabel}>Expenses</Text>
        <Text style={styles.receiptValue}>${expenses}</Text>
      </View>
      
      <View style={styles.receiptDivider} />
      
      <View style={styles.receiptRow}>
        <Text style={[styles.receiptLabel, styles.totalLabel]}>Total</Text>
        <Text style={[styles.receiptValue, styles.totalValue]}>${total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.receiptRow}>
        <Text style={[styles.receiptLabel, styles.totalLabel]}>Total Charged</Text>
        <Text style={[styles.receiptValue, styles.totalValue]}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderTaskInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Cleaner</Text>
        <Text style={styles.taskInfoValue}>{selectedCleaner?.name}</Text>
      </View>
      
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Service</Text>
        <Text style={styles.taskInfoValue}>{bookingData.cleaningType}</Text>
      </View>
      
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Date & Time</Text>
        <Text style={styles.taskInfoValue}>{getBookingTimeDisplay()}</Text>
      </View>
      
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Duration</Text>
        <Text style={styles.taskInfoValue}>{bookingData.bookingHours} hours</Text>
      </View>
      
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Location</Text>
        <Text style={styles.taskInfoValue}>{bookingData.neighborhood}</Text>
      </View>
      
      {bookingData.homeAddress && (
        <View style={styles.taskInfoRow}>
          <Text style={styles.taskInfoLabel}>Address</Text>
          <Text style={styles.taskInfoValue}>{bookingData.homeAddress}</Text>
        </View>
      )}
      
      <View style={styles.taskInfoRow}>
        <Text style={styles.taskInfoLabel}>Space</Text>
        <Text style={styles.taskInfoValue}>
          {bookingData.bedrooms} bed, {bookingData.bathrooms} bath
        </Text>
      </View>
      
      {bookingData.bookingNotes && (
        <View style={styles.taskInfoRow}>
          <Text style={styles.taskInfoLabel}>Notes</Text>
          <Text style={styles.taskInfoValue}>{bookingData.bookingNotes}</Text>
        </View>
      )}
      
      {/* Cleaner Profile */}
      <View style={styles.cleanerProfileSection}>
        <View style={styles.cleanerHeader}>
          <Image 
            source={selectedCleaner.profilePic}
            style={styles.cleanerProfileImage}
            resizeMode="cover"
          />
          <View style={styles.cleanerInfo}>
            <View style={styles.cleanerNameRow}>
              <Text style={styles.cleanerName}>{selectedCleaner.name}</Text>
              {selectedCleaner.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.cleanerRatingRow}>
              <Text style={styles.cleanerRating}>
                {'⭐'.repeat(Math.floor(selectedCleaner.rating))} {selectedCleaner.rating}
              </Text>
              <Text style={styles.cleanerReviews}>({selectedCleaner.reviews} reviews)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderChatTab = () => (
    <View style={styles.chatTabContent}>
      <View style={styles.messagesWrapper}>
        <ScrollView 
          ref={messagesContainerRef} 
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current?.scrollToEnd({ animated: false });
            }
          }}
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessage : styles.cleanerMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.cleanerMessageText
              ]}>
                {message.isVoiceMessage && '🎤 '}
                {translatedMessages[message.id] && message.translatedText 
                  ? message.translatedText 
                  : message.text}
              </Text>
              {translatedMessages[message.id] && message.translatedText && (
                <Text style={[
                  styles.originalText,
                  message.sender === 'user' ? styles.userOriginalText : styles.cleanerOriginalText
                ]}>
                  Original: {message.text}
                </Text>
              )}
              <View style={[
                styles.messageTimeAndTranslationContainer,
                message.sender === 'user' ? styles.userTimeContainer : styles.cleanerTimeContainer
              ]}>
                <Text style={[
                  styles.messageTime,
                  message.sender === 'user' ? styles.userMessageTime : styles.cleanerMessageTime
                ]}>
                  {formatMessageTime(message.timestamp)}
                </Text>
                {message.translatedText && (
                  <TouchableOpacity 
                    style={[
                      styles.translateButton,
                      message.sender === 'user' ? styles.userTranslateButton : styles.cleanerTranslateButton
                    ]}
                    onPress={() => toggleTranslation(message.id)}
                  >
                    <Text style={[
                      styles.translateButtonText,
                      message.sender === 'user' ? styles.userTranslateButtonText : styles.cleanerTranslateButtonText
                    ]}>
                      {translatedMessages[message.id] ? 'Original' : '🌐'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Message Input */}
      <View style={styles.messageInputContainer}>
        <TouchableOpacity 
          style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
          onPressIn={startRecording}
          onPressOut={stopRecording}
          activeOpacity={0.7}
        >
          <Text style={styles.voiceButtonText}>
            {isRecording ? '🔴' : '🎤'}
          </Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={isRecording ? `Recording... ${formatRecordingTime(recordingDuration)}` : "Type a message..."}
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!isRecording}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, (!newMessage.trim() && !isRecording) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() && !isRecording}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      {/* Custom Header with Back Button when onBack is provided */}
      {onBack && (
        <View style={styles.customHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Booking Detail</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      )}
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'receipt' && styles.activeTab]}
            onPress={() => setActiveTab('receipt')}
          >
            <Text style={[styles.tabText, activeTab === 'receipt' && styles.activeTabText]}>
              Receipt
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'taskInfo' && styles.activeTab]}
            onPress={() => setActiveTab('taskInfo')}
          >
            <Text style={[styles.tabText, activeTab === 'taskInfo' && styles.activeTabText]}>
              Task Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
            onPress={() => setActiveTab('chat')}
          >
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
              Chat
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'receipt' && renderReceiptTab()}
          {activeTab === 'taskInfo' && renderTaskInfoTab()}
          {activeTab === 'chat' && renderChatTab()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerSpacer: {
    width: 50, // Same width as back button for proper centering
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chatTabContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    paddingBottom: 10, // padding bottom for entire chat page
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cleanerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cleanerInfo: {
    flex: 1,
  },
  cleanerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#00D4AA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cleanerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleanerRating: {
    fontSize: 16,
    color: '#00D4AA',
    marginRight: 8,
  },
  cleanerReviews: {
    fontSize: 14,
    color: '#666',
  },
  cleanerProfileSection: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  receiptLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  taskInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskInfoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  taskInfoValue: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  messagesContainer: {
    height: '100%',
    marginBottom: 0,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#667eea',
    borderRadius: 15,
    borderBottomRightRadius: 5,
    padding: 12,
  },
  cleanerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    borderBottomLeftRadius: 5,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  cleanerMessageText: {
    color: '#333',
  },
  messageTimeAndTranslationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  cleanerMessageTime: {
    color: '#999',
    textAlign: 'left',
  },
  translateButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    opacity: 0.7,
  },
  translateButtonText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 80,
    paddingVertical: 8,
    paddingRight: 10,
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesWrapper: {
    flex: 1,
  },
  originalText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  userOriginalText: {
    textAlign: 'right',
  },
  cleanerOriginalText: {
    textAlign: 'left',
  },
  userTimeContainer: {
    justifyContent: 'flex-end',
  },
  cleanerTimeContainer: {
    justifyContent: 'flex-start',
  },
  userTranslateButton: {
    backgroundColor: 'transparent',
  },
  cleanerTranslateButton: {
    backgroundColor: 'transparent',
  },
  userTranslateButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cleanerTranslateButtonText: {
    color: '#999',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceButtonRecording: {
    backgroundColor: '#ff4d4f', // Red color for recording
  },
  voiceButtonText: {
    fontSize: 24,
  },
}); 