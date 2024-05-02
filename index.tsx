import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import type { NextPage } from 'next';
import {
  useAccount,
  useReadContract,
  useContractWrite,
} from 'wagmi';

const abi = [
];

const contractAddress = '0x6df511640a9ed4615A4679246E561f711FABDD61';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [gumballCount, setGumballCount] = useState('');

  const { data: currentGumballCount } = useReadContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: 'getNumberOfGumballs',
  });

  const { write, isLoading } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: 'addFreshGumballs',
    onMutate: () => console.log("Sending transaction..."),
    onSuccess: (tx) => {
      console.log('Transaction success:', tx);
      setGumballCount(''); 
    },
    onError: (error) => {
      console.error('Transaction error:', error);
    }
  });

  const handleGumballInput = (event) => {
    setGumballCount(event.target.value);
  };

  const handleAddGumballs = () => {
    if (gumballCount && isConnected) {
      write({
        args: [parseInt(gumballCount)]
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ADD8E6',
        padding: '0',
        gap: '20px',
      }}
    >
      <h1>Lets Do This</h1>
      <ConnectButton />
      {isConnected && (
        <>
          <input
            type="text"
            placeholder="Enter gumballs"
            value={gumballCount}
            onChange={handleGumballInput}
            style={{ width: '300px', padding: '10px' }}
          />
          <button
            type="button"
            onClick={handleAddGumballs}
            disabled={isLoading}
            style={{ padding: '10px 20px' }}
          >
            Add Gumballs
          </button>
          <p>Current Gumball Count: {currentGumballCount?.toString() || 'Loading...'}</p>
        </>
      )}
    </div>
  );
};

export default Home;
