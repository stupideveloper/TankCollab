/// @description Insert description here
// You can write your code in this editor
u = 1
dead = false
part_system = part_system_create(shield_gen_part)
part_system_layer(part_system, "Instances")
blendPercent = shader_get_uniform(grayscale_blend, "params");