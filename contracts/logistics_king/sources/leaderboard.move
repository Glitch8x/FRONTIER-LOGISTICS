module logistics_king::leaderboard {
    use sui::table::{Self, Table};
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;

    /// The Leaderboard object, shared on-chain.
    public struct Leaderboard has key {
        id: UID,
        /// Maps player address to their total volume of fuel moved.
        rankings: Table<address, u64>,
    }

    /// Initialization: Create and share the Leaderboard object.
    fun init(ctx: &mut TxContext) {
        transfer::share_object(Leaderboard {
            id: object::new(ctx),
            rankings: table::new(ctx),
        });
    }

    /// Record a trade volume for a specific player.
    /// This is called by SSUs or other "Trade Hub" modules.
    public fun record_trade(
        board: &mut Leaderboard, 
        player: address, 
        volume: u64
    ) {
        if (table::contains(&board.rankings, player)) {
            let current_total = table::borrow_mut(&mut board.rankings, player);
            *current_total = *current_total + volume;
        } else {
            table::add(&mut board.rankings, player, volume);
        };
    }

    /// Public getter for rankings.
    public fun get_volume(board: &Leaderboard, player: address): u64 {
        if (table::contains(&board.rankings, player)) {
            *table::borrow(&board.rankings, player)
        } else {
            0
        }
    }
}
