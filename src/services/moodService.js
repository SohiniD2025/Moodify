import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { formatISO } from 'date-fns'
import { db } from './firebase'

export const moodMetrics = ['happiness', 'sadness', 'anxiety', 'anger', 'energy']

export const createMoodEntry = async ({ userId, values, journalText }) => {
  const now = new Date()
  await addDoc(collection(db, 'moodEntries'), {
    userId,
    date: formatISO(now, { representation: 'date' }),
    createdAt: now.toISOString(),
    ...values,
    journalText: journalText ?? '',
  })
}

export const fetchMoodEntries = async ({ userId, fromDate, toDate }) => {
  const entriesRef = collection(db, 'moodEntries')
  const snapshot = await getDocs(query(entriesRef, where('userId', '==', userId)))
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  return results
    .filter((entry) => (!fromDate ? true : entry.date >= fromDate))
    .filter((entry) => (!toDate ? true : entry.date <= toDate))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const deleteMoodEntry = async (entryId) => {
  await deleteDoc(doc(db, 'moodEntries', entryId))
}
