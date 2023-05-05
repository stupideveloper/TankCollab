abstract class Packet {
    instanceFactory: Boolean = false;
    abstract deserialise(serialised: Object): Packet
    abstract serialise(): Object
    
}
class PacketFactory {
    static getFactory(): Function {
        return ()=>{}
    }
}
class GameDimension {
    static MAINWORLD = 0;
}
class GamePlayer {
    playerName: String
    uuid: String
    x: BigInt
    y: BigInt
}
function InitialiseDataStructures(): void {
    DimensionMap.set("overworld",GameDimension.MAINWORLD)

    PacketMap.set("C2SPositionUpdatePacket",new C2SPositionUpdatePacket())
}
const DimensionMap: Map<String,GameDimension> = new Map();
const PacketMap: Map<String,Packet> = new Map();

class C2SPositionUpdatePacket implements Packet {
    player: GamePlayer;
    x: BigInt;
    y: BigInt;
    dim: GameDimension;
    instanceFactory: Boolean = false;
    constructor(player: void|GamePlayer,x: void|BigInt,y: void|BigInt,dimension: void|GameDimension) {
        if ((player instanceof GamePlayer) && (x instanceof BigInt) && (y instanceof BigInt) && (dimension instanceof GameDimension)) {
            this.player = player;
            this.x = x;
            this.y = y;
            this.dim = dimension
        } else {
            this.instanceFactory = true;
        }
    }
    
    deserialise(serialised: any): Packet {
        if (serialised.player && serialised.x && serialised.y && serialised.dim) {
            return new C2SPositionUpdatePacket(serialised.player,serialised.x,serialised.y,serialised.dim)
        }
        throw new Error("Method not implemented.");
    }
    serialise(): Object {
        if (this.instanceFactory) {
            throw new Error("Cannot serialise a factory");
        } else {
            return {
                player: this.player,
                x: this.x,
                y: this.y,
                dim: this.dim
            }
        }
    }
}