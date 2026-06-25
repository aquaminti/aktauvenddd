"""
Генерирует брендированные плейсхолдер-изображения для папок public/images/<id>/.
Используются до того, как будут загружены реальные фотографии автоматов.
Каждое изображение — узнаваемая карточка с номером точки и силуэтом вендингового автомата,
выполненная в цветах фирменного стиля AKTAUVEND (тёмно-синий + рабочий синий).
"""
import os
import random
from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_ROOT = os.path.join(SCRIPT_DIR, "..", "public", "images")

MACHINES = {
    1: {"count": 5, "address": "27-й мкр, 8/2"},
    2: {"count": 3, "address": "ЖК Birlik, 19 мкр, 36/1"},
    3: {"count": 3, "address": "17-й микрорайон"},
    4: {"count": 7, "address": "ЖК Мамыр, 3 мкр, 8"},
    5: {"count": 4, "address": "8-й мкр, 28"},
    6: {"count": 2, "address": "4-й мкр, 31"},
    7: {"count": 4, "address": "11-й мкр, 11/2"},
}

NAVY = (11, 37, 69)
BLUE = (29, 95, 191)
LIGHT_BLUE = (63, 169, 245)
WHITE = (255, 255, 255)
PANEL = (244, 246, 249)

W, H = 900, 1200

def get_font(size, bold=False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()

def draw_machine_silhouette(draw, x, y, w, h, variant=0):
    """Рисует упрощённый силуэт вендингового автомата."""
    body_color = WHITE
    outline = LIGHT_BLUE


    draw.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=body_color, outline=outline, width=4)


    top_h = h * 0.12
    draw.rounded_rectangle([x + w*0.06, y + h*0.05, x + w*0.94, y + h*0.05 + top_h], radius=8, fill=NAVY)


    glass_top = y + h*0.22
    glass_bottom = y + h*0.62
    draw.rounded_rectangle([x + w*0.08, glass_top, x + w*0.92, glass_bottom], radius=10, fill=(225, 236, 247), outline=outline, width=3)


    cols = 4
    rows = 3
    cell_w = (w * 0.84) / cols
    cell_h = (glass_bottom - glass_top - 20) / rows
    random.seed(variant + x)
    colors = [BLUE, LIGHT_BLUE, NAVY, (90, 140, 200)]
    for r in range(rows):
        for c in range(cols):
            cx = x + w*0.08 + 10 + c * cell_w + cell_w*0.18
            cy = glass_top + 10 + r * cell_h + cell_h*0.1
            cw = cell_w * 0.6
            ch = cell_h * 0.75
            col = random.choice(colors)
            draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=6, fill=col)


    kb_top = glass_bottom + h*0.05
    kb_bottom = kb_top + h*0.12
    draw.rounded_rectangle([x + w*0.08, kb_top, x + w*0.92, kb_bottom], radius=8, fill=PANEL, outline=outline, width=2)
    btn_cols = 6
    btn_w = (w*0.8) / btn_cols
    for c in range(btn_cols):
        bx = x + w*0.1 + c*btn_w
        by = kb_top + (kb_bottom-kb_top)*0.25
        draw.ellipse([bx, by, bx+btn_w*0.4, by+ (kb_bottom-kb_top)*0.5], outline=NAVY, width=2)


    slot_top = kb_bottom + h*0.04
    slot_bottom = y + h - h*0.06
    draw.rounded_rectangle([x + w*0.3, slot_top, x + w*0.7, slot_bottom], radius=6, fill=NAVY)

def make_image(machine_id, idx, address):
    img = Image.new("RGB", (W, H), PANEL)
    draw = ImageDraw.Draw(img)


    draw.rectangle([0, 0, W, 90], fill=NAVY)
    font_brand = get_font(34, bold=True)
    draw.text((36, 24), "AKTAUVEND", font=font_brand, fill=WHITE)


    machine_w = W * 0.55
    machine_h = H * 0.62
    mx = (W - machine_w) / 2
    my = 140
    draw_machine_silhouette(draw, mx, my, machine_w, machine_h, variant=machine_id*10+idx)


    font_label = get_font(30, bold=True)
    font_small = get_font(22)
    label = f"Точка №{machine_id} · Фото {idx}"
    draw.text((36, H - 150), label, font=font_label, fill=NAVY)
    draw.text((36, H - 105), address, font=font_small, fill=(90, 100, 110))
    draw.text((36, H - 70), "Временное изображение — будет заменено", font=font_small, fill=(150, 158, 168))

    os.makedirs(f"{OUT_ROOT}/{machine_id}", exist_ok=True)
    out_path = f"{OUT_ROOT}/{machine_id}/{machine_id}.{idx}.png"
    img.save(out_path, "PNG")
    return out_path

if __name__ == "__main__":
    created = []
    for mid, info in MACHINES.items():
        for i in range(1, info["count"] + 1):
            path = make_image(mid, i, info["address"])
            created.append(path)
    print(f"Создано {len(created)} изображений")
