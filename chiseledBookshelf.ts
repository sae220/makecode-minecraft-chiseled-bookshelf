//% color="#D83B01" weight=65
namespace chiseledBookshelf {
    //% block="agent place a book into slot $slot in a bookshelf"
    //% weight=2
    //% slot.defl=1 slot.min=1 slot.max=6
    export function agentPlaceBookIntoBookshelf(slot: number) {
        if (agent.inspect(AgentInspection.Block, SixDirection.Forward) != Block.ChiseledBookshelf)
            return player.execute("playanimation @c shake_head");
        const blockState = agent.inspect(AgentInspection.Data, SixDirection.Forward);
        const direction = blockState % 4;
        if (!agentIsFacingToBlock(direction))
            return player.execute("playanimation @c shake_head");
        const books_stored = Math.floor(blockState / 4);
        if (bookIsPlacedInSlot(slot, books_stored))
            return player.execute("playanimation @c shake_head");
        const new_books_stored = books_stored + 2 ** (slot - 1);
        player.execute("playanimation @c swing_arm");
        blocks.loadStructure(
            `chiseled_bookshelves:bookshelf_${new_books_stored}`,
            getAgentFacingPosition(),
            direction
        );
    }

    //% block="agent remove a book from slot $slot in a bookshelf"
    //% weight=1
    //% slot.defl=1 slot.min=1 slot.max=6
    export function agentRemoveBookFromBookshelf(slot: number) {
        if (agent.inspect(AgentInspection.Block, SixDirection.Forward) != Block.ChiseledBookshelf)
            return player.execute("playanimation @c shake_head");
        const blockState = agent.inspect(AgentInspection.Data, SixDirection.Forward);
        const direction = blockState % 4;
        if (!agentIsFacingToBlock(direction))
            return player.execute("playanimation @c shake_head");
        const books_stored = Math.floor(blockState / 4);
        if (!bookIsPlacedInSlot(slot, books_stored))
            return player.execute("playanimation @c shake_head");
        const new_books_stored = books_stored - 2 ** (slot - 1);
        player.execute("playanimation @c swing_arm");
        blocks.loadStructure(
            `chiseled_bookshelves:bookshelf_${new_books_stored}`,
            getAgentFacingPosition(),
            direction
        );
    }

    function agentIsFacingToBlock(blockDirection: number): boolean {
        if ((positions.toCompassDirection(agent.getOrientation()) + 1) % 5 == (blockDirection + 1) % 4) {
            return true;
        }
        return false;
    }

    function bookIsPlacedInSlot(slot: number, books_stored: number): boolean {
        return !!((books_stored >> (slot - 1)) & 1);
    }

    function getAgentFacingPosition(): Position {
        switch (positions.toCompassDirection(agent.getOrientation())) {
            case 4:
                return positions.add(agent.getPosition(), pos(1, 0, 0));
            case 1:
                return positions.add(agent.getPosition(), pos(-1, 0, 0));
            case 0:
                return positions.add(agent.getPosition(), pos(0, 0, -1));
            case 2:
                return positions.add(agent.getPosition(), pos(0, 0, 1));
            default:
                return agent.getPosition();
        }
    }
}