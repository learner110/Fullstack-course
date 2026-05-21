import { create } from 'zustand';

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set((state) => ({ good: state.good + 1 })),
    incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set((state) => ({ bad: state.bad + 1 })),
  },
}));

export const useGood = () => useFeedbackStore((state) => state.good);
export const useNeutral = () => useFeedbackStore((state) => state.neutral);
export const useBad = () => useFeedbackStore((state) => state.bad);
export const useFeedbackActions = () => useFeedbackStore((state) => state.actions);


export const useTotal = () => {
  const good = useGood();
  const neutral = useNeutral();
  const bad = useBad();
  return good + neutral + bad;
};

export const useAverage = () => {
  const good = useGood();
  const bad = useBad();
  const total = useTotal();
  if (total === 0) return 0;
  return (good - bad) / total;
};

export const usePositivePercent = () => {
  const good = useGood();
  const total = useTotal();
  if (total === 0) return 0;
  return (good / total) * 100;
};