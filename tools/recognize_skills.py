#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
技能图片识别脚本
识别图片中的技能信息并生成markdown文档
"""

import os
import sys
from pathlib import Path
from datetime import datetime
import re

try:
    from PIL import Image
except ImportError:
    print("请先安装依赖: pip install pillow")
    sys.exit(1)

# 尝试使用不同的OCR库
OCR_LIB = None

# 尝试使用easyocr
try:
    import easyocr
    OCR_LIB = 'easyocr'
    print("使用 EasyOCR 进行识别")
except ImportError:
    pass

# 如果easyocr不可用，尝试使用paddleocr
if not OCR_LIB:
    try:
        from paddleocr import PaddleOCR
        OCR_LIB = 'paddleocr'
        print("使用 PaddleOCR 进行识别")
    except ImportError:
        pass

# 如果都不可用，尝试使用pytesseract
if not OCR_LIB:
    try:
        import pytesseract
        OCR_LIB = 'pytesseract'
        print("使用 Tesseract OCR 进行识别")
    except ImportError:
        pass

if not OCR_LIB:
    print("错误: 未找到可用的OCR库")
    print("请安装以下任一OCR库:")
    print("  1. pip install easyocr  (推荐)")
    print("  2. pip install paddleocr")
    print("  3. pip install pytesseract (需要安装Tesseract OCR引擎)")
    sys.exit(1)

# 初始化OCR
if OCR_LIB == 'easyocr':
    reader = easyocr.Reader(['ch_sim', 'en'], gpu=False)
elif OCR_LIB == 'paddleocr':
    ocr = PaddleOCR(use_angle_cls=True, lang='ch')

def recognize_image(image_path):
    """识别图片中的文字"""
    try:
        if OCR_LIB == 'easyocr':
            results = reader.readtext(str(image_path))
            text = '\n'.join([result[1] for result in results])
        elif OCR_LIB == 'paddleocr':
            results = ocr.ocr(str(image_path), cls=True)
            if results and results[0]:
                text = '\n'.join([line[1][0] for line in results[0] if line])
            else:
                text = ''
        elif OCR_LIB == 'pytesseract':
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang='chi_sim+eng', config='--psm 6')
        else:
            return None
        return text
    except Exception as e:
        print(f"识别图片 {image_path} 时出错: {e}")
        return None

def extract_skill_info(text):
    """从识别文本中提取技能信息"""
    if not text:
        return None
    
    lines = text.strip().split('\n')
    lines = [line.strip() for line in lines if line.strip()]
    
    return '\n'.join(lines)

def process_folder(folder_path, category_name, output_dir):
    """处理文件夹中的所有图片"""
    folder = Path(folder_path)
    if not folder.exists():
        print(f"文件夹不存在: {folder_path}")
        return
    
    png_files = sorted(folder.glob('*.png'))
    if not png_files:
        print(f"文件夹中没有找到PNG图片: {folder_path}")
        return
    
    print(f"找到 {len(png_files)} 张图片，开始识别...")
    
    skills = []
    for i, png_file in enumerate(png_files, 1):
        print(f"正在识别 [{i}/{len(png_files)}]: {png_file.name}")
        text = recognize_image(png_file)
        if text:
            skill_text = extract_skill_info(text)
            skills.append({
                'filename': png_file.name,
                'text': skill_text
            })
        else:
            print(f"  警告: {png_file.name} 识别失败")
    
    # 生成markdown文档
    generate_markdown(skills, category_name, output_dir)

def generate_markdown(skills, category_name, output_dir):
    """生成markdown文档"""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # 确定文档名称
    if '神通' in category_name:
        doc_name = '鬼王神通技能描述.md'
    elif '造化' in category_name:
        doc_name = '鬼王造化技能描述.md'
    elif '天书' in category_name:
        doc_name = '鬼王天书技能描述.md'
    else:
        doc_name = f'鬼王{category_name}技能描述.md'
    
    doc_path = output_path / doc_name
    
    with open(doc_path, 'w', encoding='utf-8') as f:
        # 写入标题
        title = category_name.replace('1/', '').replace('\\', '')
        f.write(f"# 鬼王{title}技能描述\n\n")
        f.write(f"数据来源：`doc/参考/鬼王/1/{title}`\n\n")
        
        # 写入每个技能
        for i, skill in enumerate(skills):
            # 尝试从文本中提取技能名称（第一行通常是技能名称）
            lines = skill['text'].split('\n')
            skill_name = lines[0].strip() if lines else f"技能{i+1}"
            
            # 清理技能名称（移除可能的等级信息）
            skill_name = re.sub(r'\s+\d+/\d+.*$', '', skill_name).strip()
            
            f.write(f"## {skill_name}\n\n")
            f.write("```\n")
            f.write(skill['text'])
            f.write("\n```\n\n")
            f.write("---\n\n")
        
        # 写入文档信息
        f.write(f"\n**文档生成时间**: {datetime.now().strftime('%Y-%m-%d')}\n")
        f.write("**数据来源**: 游戏截图识别（仅1目录）\n")
    
    print(f"\n文档已生成: {doc_path}")
    print(f"共识别 {len(skills)} 个技能")

def main():
    """主函数"""
    base_dir = Path(__file__).parent.parent
    
    # 定义要处理的文件夹
    folders = [
        {
            'path': base_dir / 'doc' / '参考' / '鬼王' / '1' / '神通',
            'name': '神通',
            'output': base_dir / 'docs' / '技能描述' / '鬼王'
        },
        {
            'path': base_dir / 'doc' / '参考' / '鬼王' / '1' / '造化',
            'name': '造化',
            'output': base_dir / 'docs' / '技能描述' / '鬼王'
        },
        {
            'path': base_dir / 'doc' / '参考' / '鬼王' / '天书',
            'name': '天书',
            'output': base_dir / 'docs' / '技能描述' / '鬼王'
        }
    ]
    
    for folder_info in folders:
        print(f"\n{'='*60}")
        print(f"处理文件夹: {folder_info['name']}")
        print(f"{'='*60}")
        process_folder(
            folder_info['path'],
            folder_info['name'],
            folder_info['output']
        )

if __name__ == '__main__':
    main()
