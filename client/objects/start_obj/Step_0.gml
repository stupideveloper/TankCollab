/// @description Insert description here
// You can write your code in this editor
flasher ++
if (global.has_forced_server) {
global.IP_ADDR = global.forced_server
//room_goto(Room1)

}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("0"))) {
    global.ip_construct += "0"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("1"))) {
    global.ip_construct += "1"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("2"))) {
    global.ip_construct += "2"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("3"))) {
    global.ip_construct += "3"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("4"))) {
    global.ip_construct += "4"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("5"))) {
    global.ip_construct += "5"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("6"))) {
    global.ip_construct += "6"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("7"))) {
    global.ip_construct += "7"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("8"))) {
    global.ip_construct += "8"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("9"))) {
    global.ip_construct += "9"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("A"))) {
    global.ip_construct += "A"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("B"))) {
    global.ip_construct += "B"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("C"))) {
    global.ip_construct += "C"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("D"))) {
    global.ip_construct += "D"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("E"))) {
    global.ip_construct += "E"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("F"))) {
    global.ip_construct += "F"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("G"))) {
    global.ip_construct += "G"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("H"))) {
    global.ip_construct += "H"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("I"))) {
    global.ip_construct += "I"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("J"))) {
    global.ip_construct += "J"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("K"))) {
    global.ip_construct += "K"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("L"))) {
    global.ip_construct += "L"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("M"))) {
    global.ip_construct += "M"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("N"))) {
    global.ip_construct += "N"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("O"))) {
    global.ip_construct += "O"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("P"))) {
    global.ip_construct += "P"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("Q"))) {
    global.ip_construct += "Q"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("R"))) {
    global.ip_construct += "R"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("S"))) {
    global.ip_construct += "S"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("T"))) {
    global.ip_construct += "T"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("U"))) {
    global.ip_construct += "U"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("V"))) {
    global.ip_construct += "V"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("W"))) {
    global.ip_construct += "W"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("X"))) {
    global.ip_construct += "X"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("Y"))) {
    global.ip_construct += "Y"
}

if (string_length(global.ip_construct) < 7 && keyboard_check_pressed(ord("Z"))) {
    global.ip_construct += "Z"
}

if (keyboard_check_pressed(vk_escape)) {
	room_goto(NameSelectRoom)
}

if (keyboard_check(vk_backspace)) {
	pressed = pressed + 1
	if (pressed == 1 or (pressed mod 7 == 1 && pressed > 20))  global.ip_construct = string_delete(global.ip_construct,string_length(global.ip_construct),1)
} else {
	pressed = 0
}
if (keyboard_check_pressed(vk_enter) && string_length(global.ip_construct) == 7) {
	if (IPCheck(decodeCode(global.ip_construct))) {
		var ip = decodeCode(global.ip_construct)
		if (ip == "127.0.0.1") ip = "localhost"
		global.IP_ADDR = ip
		room_goto(Room1)
		
	}
}