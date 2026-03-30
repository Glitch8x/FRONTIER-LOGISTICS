import { SuiClient } from '@mysten/sui/client';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

// Configure the Sui Testnet client correctly for v2.x
const client = new SuiClient({ url: getJsonRpcFullnodeUrl('testnet') });

// The ID of the shared Leaderboard object after deployment
export const LEADERBOARD_OBJECT_ID = "0xYourLeaderboardObjectID"; 

export async function fetchLeaderboard() {
  try {
    const object = await client.getObject({
      id: LEADERBOARD_OBJECT_ID,
      options: { showContent: true }
    });

    // Parse the table data (simplified for this example)
    // In a real SSU indexer, you'd iterate through the table entries
    if (object.data?.content?.dataType === 'moveObject') {
       return (object.data.content.fields as any).rankings;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch leaderboard from Sui:", error);
    return null;
  }
}
