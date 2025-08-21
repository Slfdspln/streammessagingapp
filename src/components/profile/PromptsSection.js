import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PromptsSection = () => {
  const [prompts, setPrompts] = useState([
    { id: '1', question: null, answer: '' },
    { id: '2', question: null, answer: '' },
    { id: '3', question: null, answer: '' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [promptType, setPromptType] = useState('select'); // 'select' or 'answer'

  const promptQuestions = [
    'The one thing I want to know about you is...',
    'My simple pleasures are...',
    'The key to my heart is...',
    "I'm looking for...",
    'The best way to ask me out is...',
    'I get along best with people who...',
    "I'm most attracted to...",
    'My ideal first date would be...',
    'My most irrational fear is...',
    'My favorite quality in a person is...',
  ];

  const handleAddPrompt = id => {
    setCurrentPrompt(id);
    setPromptType('select');
    setModalVisible(true);
  };

  const handleSelectPrompt = question => {
    const updatedPrompts = prompts.map(prompt =>
      prompt.id === currentPrompt ? { ...prompt, question } : prompt
    );

    setPrompts(updatedPrompts);
    setPromptType('answer');
  };

  const handleSaveAnswer = answer => {
    const updatedPrompts = prompts.map(prompt =>
      prompt.id === currentPrompt ? { ...prompt, answer } : prompt
    );

    setPrompts(updatedPrompts);
    setModalVisible(false);
  };

  const handleEditPrompt = id => {
    const prompt = prompts.find(p => p.id === id);
    setCurrentPrompt(id);

    if (prompt.question) {
      setPromptType('answer');
      setModalVisible(true);
    } else {
      setPromptType('select');
      setModalVisible(true);
    }
  };

  const handleRemovePrompt = id => {
    const updatedPrompts = prompts.map(prompt =>
      prompt.id === id ? { ...prompt, question: null, answer: '' } : prompt
    );

    setPrompts(updatedPrompts);
  };

  const renderPromptItem = ({ item }) => (
    <View style={styles.promptContainer}>
      {item.question ? (
        <View style={styles.promptContent}>
          <Text style={styles.promptQuestion}>{item.question}</Text>
          <Text style={styles.promptAnswer}>{item.answer || 'Tap to add an answer'}</Text>

          <View style={styles.promptActions}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditPrompt(item.id)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePrompt(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#FF5864" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addPromptButton} onPress={() => handleAddPrompt(item.id)}>
          <Ionicons name="add-circle" size={24} color="#FF5864" />
          <Text style={styles.addPromptText}>Add a prompt</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPromptQuestionItem = ({ item }) => (
    <TouchableOpacity style={styles.promptQuestionItem} onPress={() => handleSelectPrompt(item)}>
      <Text style={styles.promptQuestionText}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PROMPTS</Text>

      <View style={styles.promptsList}>
        <FlatList
          data={prompts}
          renderItem={renderPromptItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {promptType === 'select' ? (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select a prompt</Text>
                  <View style={{ width: 40 }} />
                </View>

                <FlatList
                  data={promptQuestions}
                  renderItem={renderPromptQuestionItem}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  style={styles.promptQuestionsList}
                />
              </>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setPromptType('select')}
                  >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Your answer</Text>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => {
                      const prompt = prompts.find(p => p.id === currentPrompt);
                      handleSaveAnswer(prompt.answer);
                    }}
                  >
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.answerContainer}>
                  <Text style={styles.answerPrompt}>
                    {prompts.find(p => p.id === currentPrompt)?.question}
                  </Text>

                  <TextInput
                    style={styles.answerInput}
                    multiline
                    placeholder="Type your answer here..."
                    placeholderTextColor="#999"
                    value={prompts.find(p => p.id === currentPrompt)?.answer}
                    onChangeText={text => {
                      const updatedPrompts = prompts.map(prompt =>
                        prompt.id === currentPrompt ? { ...prompt, answer: text } : prompt
                      );
                      setPrompts(updatedPrompts);
                    }}
                    maxLength={250}
                  />

                  <Text style={styles.characterCount}>
                    {250 - (prompts.find(p => p.id === currentPrompt)?.answer.length || 0)}{' '}
                    characters left
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  promptsList: {
    marginBottom: 16,
  },
  promptContainer: {
    paddingVertical: 12,
  },
  promptContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  promptActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 14,
    color: '#0084FF',
    fontWeight: '500',
  },
  removeButton: {
    padding: 6,
  },
  addPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
  },
  addPromptText: {
    fontSize: 16,
    color: '#FF5864',
    fontWeight: '500',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  closeButton: {
    padding: 5,
    width: 40,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    padding: 5,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5864',
  },
  promptQuestionsList: {
    maxHeight: '80%',
  },
  promptQuestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  promptQuestionText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
  },
  answerPrompt: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  answerInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default PromptsSection;
