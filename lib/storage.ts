import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_STORAGE_KEY = "notes";

export const saveNote = async (note: Note): Promise<void> => {
  try {
    const notes = await loadNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);

    if (existingIndex >= 0) {
      // Update existing note
      notes[existingIndex] = note;
    } else {
      // Add new note
      notes.push(note);
    }

    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving note:", error);
    throw error;
  }
};

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    if (!notesJson) return [];

    const notes = JSON.parse(notesJson);
    // Convert date strings back to Date objects
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      taskList:
        note.taskList?.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        })) || [],
    }));
  } catch (error) {
    console.error("Error loading notes:", error);
    return [];
  }
};

export const loadNote = async (id: number): Promise<Note | null> => {
  try {
    const notes = await loadNotes();
    return notes.find((note) => note.id === id) || null;
  } catch (error) {
    console.error("Error loading note:", error);
    return null;
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    const notes = await loadNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);
    await AsyncStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify(filteredNotes)
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};
