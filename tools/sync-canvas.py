"""Update the two project canvases, preserving existing user layout and extra notes."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
folder = root / 'Obsidian' / '思维导图'
folder.mkdir(parents=True, exist_ok=True)

def save(name, cards, edges):
    path = folder / (name + '.canvas')
    data = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'nodes': [], 'edges': []}
    for card in cards:
        existing = next((n for n in data['nodes'] if n['id'] == card['id']), None)
        if existing:
            for key in ('text', 'file', 'type'):
                if key in card: existing[key] = card[key]
        else: data['nodes'].append(card)
    ids = {e['id'] for e in edges}
    data['edges'] = [e for e in data['edges'] if e['id'] not in ids] + edges
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def text(node_id, x, y, value):
    return {'id': node_id, 'type': 'text', 'x': x, 'y': y, 'width': 290, 'height': 150, 'text': value}

def edge(node_id, a, b, label='依赖'):
    return {'id': node_id, 'fromNode': a, 'toNode': b, 'fromSide': 'right', 'toSide': 'left', 'toEnd': 'arrow', 'label': label}

todo = (root/'todo.md').read_text(encoding='utf-8')
published = '- [x] P4 发布源码' in todo
checked = '- [x] P3 构建' in todo
save('项目-开发计划图', [
    text('P1', 0, 0, 'P1 必做／已验收\n旧站保存、方向确认\n技术工作台 + 日常分享'),
    text('P2', 370, 0, 'P2 必做／已验收\n自定义主题、文章、搜索\n米黄背景 + 柔黑文字'),
    text('P3', 740, 0, 'P3 必做／' + ('已验收' if checked else '进行中') + '\n构建、内部链接、三种宽度与交互检查'),
    text('P4', 1110, 0, 'P4 必做／' + ('已验收' if published else '待实现') + '\nsource 保存源码，main 发布\n核对线上内容'),
    text('B1', 1480, -150, 'B1 可选／延期\n迁移至其他托管或服务器'),
    text('B2', 1480, 150, 'B2 可选／延期\n按需要接入评论'),
    {'id':'plan-doc','type':'file','x':370,'y':260,'width':660,'height':240,'file':'资料/Library/项目-开发计划图.md'}
], [edge('P1-P2','P1','P2'),edge('P2-P3','P2','P3'),edge('P3-P4','P3','P4'),edge('P4-B1','P4','B1','可选'),edge('P4-B2','P4','B2','可选')])
save('项目-系统运行流程图', [
    text('S1',0,0,'S1 当前实现\nMarkdown、图片与站点配置'),
    text('S2',370,0,'S2 当前实现\nHexo + mocliffood 主题构建'),
    text('S3',740,0,'S3 当前实现\nHTML、CSS、搜索 JSON、RSS、站点地图'),
    text('S4',1110,0,'S4 当前实现／校验分支\n构建与内部链接检查是否通过？'),
    text('S5',740,230,'S5 当前实现\n检查失败：修复源码后重新构建'),
    text('S6',1480,0,'S6 ' + ('已验证' if published else '待验证') + '\nSSH 推送 main，保留发布历史'),
    text('S7',1850,0,'S7 ' + ('已验证' if published else '待验证') + '\nGitHub Pages 分发'),
    text('S8',2220,0,'S8 本地已验证\n阅读、搜索、主题筛选、深浅色切换'),
    {'id':'runtime-doc','type':'file','x':0,'y':260,'width':660,'height':240,'file':'资料/Library/项目-系统运行流程图.md'}
], [edge('S1-S2','S1','S2','内容与配置'),edge('S2-S3','S2','S3','静态产物'),edge('S3-S4','S3','S4'),edge('S4-S5','S4','S5','否'),edge('S5-S2','S5','S2','重建'),edge('S4-S6','S4','S6','是'),edge('S6-S7','S6','S7','发布'),edge('S7-S8','S7','S8','访问')])
(folder/'00-导航.md').write_text('# 项目思维导图\n\n- [[思维导图/项目-开发计划图.canvas]]\n- [[思维导图/项目-系统运行流程图.canvas]]\n\n对应原图：[[资料/Library/项目-开发计划图]]、[[资料/Library/项目-系统运行流程图]]。\n', encoding='utf-8')
print('Updated two editable Canvas maps; existing positions and unrelated notes retained.')
