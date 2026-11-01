# สไลม์รัน (Slime Run)

เกมวิ่งหลบมอนสเตอร์แนว 2D (HTML5 canvas) เล่นออฟไลน์ได้ ไม่ต้องมี build step

## วิธีรัน
- **ง่ายสุด:** ดับเบิลคลิก `index.html` (ทำงานผ่าน `file://` ได้ เพราะใช้สคริปต์ธรรมดา ไม่ใช่ ES modules)
- หรือรันเซิร์ฟเวอร์ในเครื่อง: `python3 -m http.server 8000` แล้วเปิด http://localhost:8000
- ไฟล์เดียวรวมทุกอย่าง (ส่งต่อง่าย): `python3 tools/bundle.py` → `dist/slime-run-single.html`

## โครงสร้าง
```
index.html            หน้าเดียว: HUD, overlay, ปุ่ม และรายการ <script> (ลำดับโหลดสำคัญ)
css/
  tokens.css          สี/ฟอนต์ทั้งหมด (โหมดสว่าง/มืด) — canvas อ่านสีจากที่นี่ด้วย
  base.css            เลย์เอาต์หน้า, stage, overlay, ปุ่ม
  hud-touch.css       HUD, ปุ่มทัช, ข้อความให้หมุนจอ
  phone.css           โหมดมือถือแนวนอนเต็มจอ
  extras.css          แอนิเมชันปุ่ม, ปุ่มมุมจอ, toast, เต็มจอ
assets/sprites/       ภาพตัวละคร PNG โปร่งใส: run_00-07 (วิ่ง 8 ท่า), jump_00-07 (กระโดด 8 ท่า)
js/
  core/               registry, util, dom, layout, colors, state
  config.js           ตัวเลขปรับสมดุลเกมทั้งหมด (ฟิสิกส์ ความเร็ว พุ่ง โลก มินิบอส)
  assets.js           โหลดสไปรต์ + ชื่อเฟรม (F_CROUCH, F_PUSH, ...)
  audio.js            เพลง/เสียงเอฟเฟกต์ (Web Audio สร้างสด ไม่มีไฟล์เสียง)
  input.js            คีย์บอร์ด/ทัช/เมาส์
  game/               flow (เริ่ม/จบ), spawn, boss (ตรรกะบอส), coins (เหรียญ+พุ่ง), update (ลูปจำลอง)
  fx/particles.js     อนุภาค
  render/             zones, obstacles, boss, coins, player, scene, helpers
  ui/buttons.js       แสดง/ซ่อนปุ่มพุ่ง-ปาดาว
  data/bosses.js      บอสสไลม์พื้นฐาน, ป้ายท่าโจมตี
  biomes/             **เนื้อหาแต่ละโลก** city / desert / sea / snow (ฉาก มอน บอส กระสุน)
  main.js             ลูปเกม, resize, ปุ่มเต็มจอ, เริ่มต้น (โหลดเป็นไฟล์สุดท้าย)
tests/smoke.py        เทสต์ควัน (Playwright): โหลดเกม + เรียกฟังก์ชันวาดทุกตัว
tools/                bundle.py (รวมเป็นไฟล์เดียว), make_artifact_page.py
docs/ARCHITECTURE.md  คู่มือพัฒนาต่อ
```

อ่านวิธีเพิ่มโลกใหม่ / บอสใหม่ / ปรับสมดุล ได้ที่ [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## ควบคุม
กระโดด: แตะที่ไหนก็ได้ / Space / ↑ (กดค้างเพื่อกระโดดสูง) · ก้ม: ปุ่มขวาล่าง / ↓ · ปาดาว (เฉพาะตอนมีบอส): F / J / X / Enter · พุ่ง (เก็บเหรียญครบ 600): E / Shift / K
