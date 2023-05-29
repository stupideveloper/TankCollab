/// @description Insert description here
// You can write your code in this editor
flasher ++
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("A"))) {
    global.name += "A"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("B"))) {
    global.name += "B"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("C"))) {
    global.name += "C"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("D"))) {
    global.name += "D"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("E"))) {
    global.name += "E"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("F"))) {
    global.name += "F"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("G"))) {
    global.name += "G"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("H"))) {
    global.name += "H"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("I"))) {
    global.name += "I"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("J"))) {
    global.name += "J"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("K"))) {
    global.name += "K"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("L"))) {
    global.name += "L"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("M"))) {
    global.name += "M"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("N"))) {
    global.name += "N"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("O"))) {
    global.name += "O"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("P"))) {
    global.name += "P"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("Q"))) {
    global.name += "Q"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("R"))) {
    global.name += "R"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("S"))) {
    global.name += "S"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("T"))) {
    global.name += "T"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("U"))) {
    global.name += "U"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("V"))) {
    global.name += "V"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("W"))) {
    global.name += "W"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("X"))) {
    global.name += "X"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("Y"))) {
    global.name += "Y"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("Z"))) {
    global.name += "Z"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("1"))) {
    global.name += "1"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("2"))) {
    global.name += "2"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("3"))) {
    global.name += "3"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("4"))) {
    global.name += "4"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("5"))) {
    global.name += "5"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("6"))) {
    global.name += "6"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("7"))) {
    global.name += "7"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("8"))) {
    global.name += "8"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("9"))) {
    global.name += "9"
}
if (string_length(global.name) < 16 && keyboard_check_pressed(ord("0"))) {
    global.name += "0"
}
if (keyboard_check_pressed(189) && string_length(global.name) >= 1 && not string_ends_with(global.name,"_")) {
    global.name += "_"
}
if (keyboard_check(vk_backspace)) {
	pressed = (pressed + 1)
	if (pressed == 1 or (pressed mod 7 == 1 && pressed > 20)) global.name = string_delete(global.name,string_length(global.name),1)
} else {
	pressed = 0
}
if (keyboard_check_pressed(vk_enter) && string_length(global.name) >= 3 && string_length(global.name) <= 16) {
	room_goto(StartRoom)
}