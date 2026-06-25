from PIL import Image, ImageDraw, ImageFont
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

NAVY = (11, 37, 69)
BLUE = (29, 95, 191)
WHITE = (255, 255, 255)

size = 256
img = Image.new("RGB", (size, size), NAVY)
draw = ImageDraw.Draw(img)
draw.rounded_rectangle([0,0,size,size], radius=40, fill=NAVY)

font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font = ImageFont.truetype(font_path, 150) if os.path.exists(font_path) else ImageFont.load_default()

text = "A"
bbox = draw.textbbox((0,0), text, font=font)
tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
draw.text(((size-tw)/2 - bbox[0], (size-th)/2 - bbox[1]), text, font=font, fill=BLUE)

img.save(os.path.join(SCRIPT_DIR, "..", "..", "client", "public", "favicon.png"), "PNG")
print("ok")
