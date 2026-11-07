from pathlib import Path
from io import BytesIO
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

import argparse
parser=argparse.ArgumentParser(description='Render portfolio research figures from the inspected source repositories.')
parser.add_argument('--source-root',type=Path,required=True,help='Directory containing the cloned source repositories')
parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parents[1]/'public/projects')
args=parser.parse_args()
OUT=args.output
SRC=args.source_root
OUT.mkdir(parents=True,exist_ok=True)
BG='#0e1420'; PANEL='#151e2d'; INK='#edf2f8'; MUTED='#95a4b9'; GRID='#2a3648'; TEAL='#63dbc5'; PURPLE='#b59bff'; BLUE='#83b7ff'; ORANGE='#f3ba79'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':12,'text.color':INK,'axes.labelcolor':MUTED,'xtick.color':MUTED,'ytick.color':MUTED,'axes.edgecolor':GRID,'axes.facecolor':BG,'figure.facecolor':BG,'savefig.facecolor':BG,'axes.spines.right':False,'axes.spines.top':False})
def base(kicker,title,subtitle,footer):
    fig=plt.figure(figsize=(12,7.5),dpi=150)
    fig.text(.055,.928,kicker.upper(),fontsize=11,fontweight='bold',color=TEAL)
    fig.text(.055,.858,title,fontsize=26,fontweight='bold',color=INK)
    fig.text(.055,.81,subtitle,fontsize=11,color=MUTED)
    fig.text(.055,.035,footer,fontsize=8.5,color=MUTED)
    return fig

def save(fig,name):
    buffer=BytesIO()
    fig.savefig(buffer,dpi=150,format='png')
    (OUT/name).write_bytes(buffer.getvalue())
    plt.close(fig)

# Values copied exactly from winequality.ipynb cell 12 output.
names=['Random Forest','Logistic Regression','XGBoost','SVC','KNN · distance, k=10','Gradient Boosting','KNN · distance, k=21','KNN · uniform, k=5']
values=np.array([.571,.561,.552,.542,.536,.534,.525,.521])
std=np.array([.029,.029,.024,.016,.010,.043,.016,.019])
fig=base('White wine quality / model comparison','Eight models. One shared benchmark.','5-fold stratified cross-validation · F1 score (mean ± standard deviation)','SOURCE  winequality.ipynb · recorded cross-validation output · Values are not new training results.')
ax=fig.add_axes([.26,.15,.64,.58]); y=np.arange(len(names))
colors=[TEAL]+['#536e91']*7
ax.barh(y,values,height=.56,color=colors,zorder=3)
ax.errorbar(values,y,xerr=std,fmt='none',ecolor='#dce7f4',capsize=3,elinewidth=1.25,zorder=4)
ax.set_yticks(y,names,fontsize=11);ax.invert_yaxis();ax.set_xlim(0,.67);ax.set_xticks(np.arange(0,.7,.1));ax.set_xlabel('F1 score',labelpad=12)
ax.grid(axis='x',color=GRID,alpha=.7,zorder=0);ax.spines['left'].set_visible(False);ax.tick_params(axis='y',length=0,pad=12)
for i,v in enumerate(values): ax.text(.661,i,f'{v:.3f}',va='center',ha='right',fontsize=11,fontweight='bold',color=TEAL if i==0 else INK)
save(fig,'wine-model-comparison.png')

# Values copied exactly from Wine_Quality-Explainable AI(XAI).ipynb cell 18.
features=['Alcohol','Density','Chlorides','Free / total sulfur ratio','pH','Citric acid','Volatile acidity','Free sulfur dioxide']
imp=np.array([.228123,.076692,.051924,.028734,.023374,.020038,.015135,.012477])
impstd=np.array([.027281,.020077,.019172,.014400,.008386,.014132,.007600,.013131])
fig=base('White wine quality / explainability','What drives a prediction?','Random Forest · permutation importance · 25 repeats · Top 8 features','SOURCE  Wine_Quality-Explainable AI(XAI).ipynb · recorded mean and standard deviation · Higher = larger F1 decrease.')
ax=fig.add_axes([.26,.15,.64,.58]);y=np.arange(len(features))
ax.barh(y,imp,height=.56,color=[TEAL]+['#536e91']*7,zorder=3)
ax.errorbar(imp,y,xerr=impstd,fmt='none',ecolor='#dce7f4',capsize=3,elinewidth=1.25,zorder=4)
ax.set_yticks(y,features,fontsize=11);ax.invert_yaxis();ax.set_xlim(0,.29);ax.set_xticks(np.arange(0,.26,.05));ax.set_xlabel('Decrease in F1 score after permutation',labelpad=12)
ax.grid(axis='x',color=GRID,alpha=.7,zorder=0);ax.spines['left'].set_visible(False);ax.tick_params(axis='y',length=0,pad=12)
for i,v in enumerate(imp):ax.text(.286,i,f'{v:.3f}',va='center',ha='right',fontsize=11,fontweight='bold',color=TEAL if i==0 else INK)
save(fig,'wine-feature-importance.png')

# Direct measurements from the repository's synthetic training CSV; no model run.
df=pd.read_csv(SRC/'DNN-Universal-Function-Approximator/data/train.csv')
fig=base('Neural function approximation / dataset','Learning a nonlinear function.',f'{len(df):,} training rows · Synthetic feature relationships before preprocessing','SOURCE  data/train.csv · Original dataset values · Each point is one row; these plots are not model predictions.')
for pos,feature,color,label in [([.095,.18,.36,.53],'f2',TEAL,'f2 · principal feature'),([.59,.18,.35,.53],'f4',PURPLE,'f4 · interaction feature')]:
    ax=fig.add_axes(pos); v=df[[feature,'target']].dropna()
    ax.scatter(v[feature],v.target,s=10,alpha=.48,color=color,edgecolors='none',rasterized=True,zorder=3)
    ax.set_xlabel(label,labelpad=10);ax.set_ylabel('Target',labelpad=10);ax.grid(color=GRID,alpha=.55,zorder=0)
    ax.text(.01,1.055,f'Pearson r = {v[feature].corr(v.target):.2f}',transform=ax.transAxes,color=color,fontsize=12,fontweight='bold')
    ax.spines['left'].set_visible(False);ax.spines['bottom'].set_visible(False)
save(fig,'dnn-data-analysis.png')

# Exact protocol layout from STM32_Modbus_DataMonitor/README.md and mainwindow.cpp.
fig=base('STM32 data monitor / protocol','Sensor readings, byte by byte.','STM32F407 ↔ Qt desktop · UART4 · 115200 baud · 8N1 demonstration','SOURCE  STM32_Modbus_DataMonitor · README.md and embeddedGui/mainwindow.cpp · Source diagram, not a hardware measurement.')
ax=fig.add_axes([0,0,1,1]);ax.set_axis_off();ax.set_xlim(0,1);ax.set_ylim(0,1)
def panel(x,y,w,h):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=0.006,rounding_size=0.012',linewidth=.9,edgecolor=GRID,facecolor=PANEL))
def txt(x,y,s,size=11,color=INK,weight='normal',ha='left'):
    ax.text(x,y,s,fontsize=size,color=color,fontweight=weight,ha=ha,va='center')
panel(.055,.455,.89,.285)
txt(.08,.70,'READ HOLDING REGISTERS',10,TEAL,'bold')
txt(.08,.654,'Function 0x03 · slave 1 · start register 0 · read all 5 registers',11,MUTED)
frame=[1,3,0,0,0,5]
crc=0xffff
for b in frame:
    crc^=b
    for _ in range(8):crc=(crc>>1)^0xa001 if crc&1 else crc>>1
frame += [crc&255,crc>>8]
labels=['Slave','Function','Start high','Start low','Count high','Count low','CRC low','CRC high']
for i,(b,label) in enumerate(zip(frame,labels)):
    x=.08+i*.105
    ax.add_patch(FancyBboxPatch((x,.53),.085,.072,boxstyle='round,pad=.004,rounding_size=.007',facecolor='#263449' if i<6 else '#32534f',edgecolor='none'))
    txt(x+.0425,.566,f'{b:02X}',16,TEAL if i>=6 else INK,'bold','center')
    txt(x+.0425,.493,label,8,MUTED,ha='center')
panel(.055,.115,.53,.29);panel(.61,.115,.335,.29)
txt(.08,.367,'THE REGISTER MAP',10,TEAL,'bold')
rows=[('0 – 1','Temperature','32-bit float'),('2 – 3','Estimated VDDA','32-bit float'),('4','Button state','0 / 1')]
for i,(reg,name,typ) in enumerate(rows):
    yy=.307-i*.068
    txt(.08,yy,reg,13,ORANGE,'bold');txt(.18,yy,name,12,INK);txt(.552,yy,typ,10,MUTED,ha='right')
    if i<2:ax.plot([.08,.56],[yy-.034,yy-.034],color=GRID,lw=.6)
txt(.635,.367,'VALIDATE BEFORE DECODE',10,TEAL,'bold')
for yy,idx,label in [(.305,'01','Address & function'),(.248,'02','Expected byte count'),(.191,'03','CRC16 / Modbus')]:
    txt(.635,yy,idx,10,ORANGE,'bold');txt(.674,yy,label,12,INK)
save(fig,'embedded-protocol.png')
print('Created 4 source-based research/protocol figures.')

# Cite the exact checked-in DEC run rather than implying current/live metrics.
import json
cine=SRC/'CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System'
result=json.loads((cine/'artifacts/eval/results.json').read_text())['dec_z64_k21']
fig=base('CineEmbed / multimodal representations','A film is more than a genre.','Seven feature blocks → one shared embedding · Recorded DEC model: z=64, k=21','SOURCE  CineEmbed figures/high-level-architecture.png and artifacts/eval/results.json · Source-derived research diagram.')
ax=fig.add_axes([0,0,1,1]);ax.set_axis_off();ax.set_xlim(0,1);ax.set_ylim(0,1)
panel(.055,.13,.29,.60);panel(.39,.13,.255,.60);panel(.69,.13,.255,.60)
txt(.08,.69,'INPUT FEATURES',10,TEAL,'bold')
blocks=[('Numerical',6),('Genre',22),('Language',31),('Decade',2),('Awards',6),('Text',384),('Director',113)]
for i,(label,count) in enumerate(blocks):
    yy=.624-i*.061
    txt(.08,yy,label,12,INK);txt(.32,yy,str(count),12,MUTED,'bold','right')
    if i<6:ax.plot([.08,.32],[yy-.029,yy-.029],color=GRID,lw=.6)
txt(.08,.174,'564 dimensions',12,TEAL,'bold')
txt(.415,.69,'REPRESENTATION',10,TEAL,'bold')
for y,label,subtitle in [(.57,'Modality projections','Per-block transformations'),(.407,'Feature fusion','164-dimensional concatenation'),(.244,'Latent space','64-dimensional embedding')]:
    txt(.5175,y,label,14,INK,'bold','center');txt(.5175,y-.043,subtitle,9.5,MUTED,ha='center')
    if y>.25:ax.add_patch(FancyArrowPatch((.5175,y-.07),(.5175,y-.115),arrowstyle='-|>',mutation_scale=12,color=TEAL,lw=1.1))
for x1,x2 in [(.349,.386),(.649,.686)]:ax.add_patch(FancyArrowPatch((x1,.43),(x2,.43),arrowstyle='-|>',mutation_scale=13,color=TEAL,lw=1.1))
txt(.715,.69,'RECORDED EVALUATION',10,TEAL,'bold')
txt(.715,.632,'Normalized mutual information',9.5,MUTED)
for i,(name,key) in enumerate([('Genre','genre_nmi'),('Decade','decade_nmi'),('Language','lang_nmi')]):
    yy=.55-i*.13;value=result[key]
    txt(.715,yy,name,12,INK);txt(.92,yy,f'{value:.3f}',15,TEAL,'bold','right')
    ax.plot([.715,.92],[yy-.039,yy-.039],lw=7,color=GRID,solid_capstyle='round')
    ax.plot([.715,.715+.205*value],[yy-.039,yy-.039],lw=7,color=TEAL,solid_capstyle='round')
txt(.715,.174,'Recorded research, not a live KPI',8.6,MUTED)
save(fig,'cineembed-architecture.png')
print('Created source-derived CineEmbed figure.')
