import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

export const useAdminPacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'packsPorMayor'), orderBy('orden', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error('Error escuchando packs:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createPack = async (packData) => {
    try {
      await addDoc(collection(db, 'packsPorMayor'), {
        ...packData,
        orden: Number(packData.orden) || 0,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al crear pack:', error);
      throw error;
    }
  };

  const updatePack = async (packId, updates) => {
    try {
      const packRef = doc(db, 'packsPorMayor', packId);
      await updateDoc(packRef, {
        ...updates,
        orden: Number(updates.orden) || 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al actualizar pack:', error);
      throw error;
    }
  };

  const deletePack = async (packId) => {
    try {
      await deleteDoc(doc(db, 'packsPorMayor', packId));
    } catch (error) {
      console.error('Error al borrar pack:', error);
      throw error;
    }
  };

  const packsPorMayor = packs.filter((p) => p.tipo === 'por-mayor');
  const packsPlanchitas = packs.filter((p) => p.tipo === 'planchitas');

  return {
    packs,
    packsPorMayor,
    packsPlanchitas,
    loading,
    createPack,
    updatePack,
    deletePack,
  };
};