/// @description Insert description here
var type = ds_map_find_value(async_load, "type")
switch (type) {
    case network_type_data: {
        if (!connected) {
            with(gem_obj) {
                instance_destroy();
            }
            global.spawned_gems = {}
            addPacket({
                type: "setname",
                name: global.name
            })
        }
        connected = true;
        var data = ds_map_find_value(async_load, "buffer")
        global.splash_data.packetsize = buffer_get_size(data)
        var s = buffer_read(data, buffer_string)
        ticks_since_update = 0
        try {
            var packets = json_parse(s);
            handlePackets(decompressPacket(packets))
        } catch (e) {
            show_debug_message(e)
        }
        break;
    };
}