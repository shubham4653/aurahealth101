

export const generateMockHash = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async hashing
    const hash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return hash;
};
