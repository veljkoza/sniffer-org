import { useState } from 'react';

const useClipboard = () => {
  const [status, setStatus] = useState<'copied' | 'error' | 'empty'>('empty');
  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Content copied to clipboard');
      setStatus('copied');
    } catch (err) {
      console.error('Failed to copy: ', err);
      setStatus('error');
    }
  };

  return { status, copyContent };
};

export { useClipboard };
