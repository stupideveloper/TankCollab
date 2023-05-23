/// @description Insert description here
var type = ds_map_find_value(async_load,"type")
switch (type) {
	case network_type_connect: {
		var socket = ds_map_find_value(async_load,"socket")
		show_debug_message("Socket Connected: " + string(socket))
		var json = json_stringify({
	type: "keepalive"
})
var buff = buffer_create(0,buffer_grow,1)
buffer_write(buff,buffer_text,json)
network_send_packet(client,buff,buffer_get_size(buff))
		break;
	};
	case network_type_disconnect: {
		var socket = ds_map_find_value(async_load,"socket")
		show_debug_message("Socket Disconnected: " + string(socket))
		network_connect_raw_async( client,"localhost", 9000 );
		break;
	};
	case network_type_data: {
		if (!connected) {
			with (gem_obj) {instance_destroy();}
			global.gems = {}
		}
		connected = true;
		var data = ds_map_find_value(async_load,"buffer")
		var s = buffer_read(data,buffer_string)
		ticks_since_update = 0
		try {
		var packets = json_parse(s);
		handlePackets(packets)
		} catch (e) {
		//	show_debug_message(e)
		}
		break;
	};
	case network_type_down: {
		show_debug_message("Socket Down")
		var server = network_connect_raw_async( client,"localhost", 9000 );
		break;
	}
	case network_type_non_blocking_connect: {
		var socket = ds_map_find_value(async_load,"socket")
		show_debug_message("Socket non blocking connect: " + string(socket))
		break;
	}
	default: {
		// show_debug_message(type)
	}
}