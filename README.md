<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>代理店 ロールプレイ練習</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; background: #f5f5f0; color: #1a1a1a; min-height: 100vh; }

.site-header { background: #fff; border-bottom: 1px solid #e0e0d8; padding: 14px 20px; display: flex; align-items: center; gap: 12px; }
.site-header .logo { width: 36px; height: 36px; background: #1D9E75; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.site-header h1 { font-size: 16px; font-weight: 600; }
.site-header p  { font-size: 12px; color: #888; }

.container { max-width: 720px; margin: 0 auto; padding: 20px 16px 40px; }

.tabs { display: flex; gap: 3px; background: #ebebeb; border-radius: 10px; padding: 3px; margin-bottom: 20px; }
.tab-btn { flex: 1; padding: 8px; text-align: center; font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer; border: none; background: none; color: #888; transition: all .15s; }
.tab-btn.active { background: #fff; color: #1a1a1a; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.staff-row { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.staff-row label { font-size: 13px; color: #666; white-space: nowrap; }
.staff-row input { flex: 1; font-size: 13px; padding: 8px 11px; border-radius: 8px; border: 1px solid #ddd; background: #fff; color: #1a1a1a; font-family: inherit; }
.staff-row input:focus { outline: none; border-color: #1D9E75; }

.diff-row { display: flex; gap: 6px; margin-bottom: 14px; align-items: center; }
.diff-row label { font-size: 13px; color: #666; white-space: nowrap; }
.diff-btn { flex: 1; padding: 7px 4px; text-align: center; font-size: 12px; font-weight: 600; border-radius: 8px; cursor: pointer; border: 1.5px solid #ddd; background: #fff; color: #888; transition: all .15s; }
.diff-btn.active-easy   { border-color: #1D9E75; background: #E1F5EE; color: #085041; }
.diff-btn.active-normal { border-color: #BA7517; background: #FAEEDA; color: #633806; }
.diff-btn.active-hard   { border-color: #A32D2D; background: #FCEBEB; color: #501313; }

/* フェーズバー */
.phase-bar { background: #fff; border: 1px solid #e4e4e0; border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; display: none; }
.phase-bar.show { display: block; }
.phase-bar-title { font-size: 11px; color: #888; margin-bottom: 8px; font-weight: 600; }
.phase-steps { display: flex; gap: 0; align-items: center; }
.phase-step { flex: 1; text-align: center; position: relative; }
.phase-step:not(:last-child)::after { content: ""; position: absolute; top: 14px; right: -1px; width: 100%; height: 2px; background: #e4e4e0; z-index: 0; }
.phase-step.done:not(:last-child)::after { background: #1D9E75; }
.ps-circle { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #e4e4e0; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #bbb; margin: 0 auto 4px; position: relative; z-index: 1; transition: all .3s; }
.phase-step.active .ps-circle { border-color: #1D9E75; background: #1D9E75; color: #fff; }
.phase-step.done .ps-circle   { border-color: #1D9E75; background: #E1F5EE; color: #085041; }
.ps-label { font-size: 10px; color: #aaa; line-height: 1.3; }
.phase-step.active .ps-label { color: #085041; font-weight: 600; }
.phase-step.done .ps-label   { color: #0F6E56; }
.phase-hint { margin-top: 10px; padding: 7px 10px; background: #f5f5f0; border-radius: 8px; font-size: 11px; color: #555; line-height: 1.6; }
.phase-hint strong { color: #1D9E75; font-weight: 600; }

.sc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 8px; margin-bottom: 14px; }
.sc-card { background: #fff; border: 1.5px solid #e4e4e0; border-radius: 12px; padding: 11px 10px; cursor: pointer; transition: border-color .15s, background .15s; }
.sc-card:hover { border-color: #aaa; }
.sc-card.active { border-color: #1D9E75; background: #E1F5EE; }
.sc-card .sc-icon { font-size: 20px; margin-bottom: 4px; }
.sc-card .sc-name { font-size: 12px; font-weight: 600; }
.sc-card.active .sc-name { color: #085041; }
.sc-card .sc-attr { font-size: 11px; color: #999; margin-top: 2px; line-height: 1.4; }
.sc-card .sc-tag { font-size: 10px; color: #0F6E56; margin-top: 5px; background: #fff; border-radius: 4px; padding: 2px 7px; display: inline-block; }

.chat-box { background: #fff; border: 1px solid #e4e4e0; border-radius: 14px; overflow: hidden; margin-bottom: 14px; }
.chat-head { padding: 10px 14px; border-bottom: 1px solid #f0f0ec; display: flex; justify-content: space-between; align-items: center; }
.ch-name { font-size: 13px; font-weight: 600; }
.ch-meta { display: flex; gap: 6px; align-items: center; }
.ch-turn { font-size: 11px; color: #aaa; }
.diff-badge { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 10px; }
.db-easy   { background: #E1F5EE; color: #085041; }
.db-normal { background: #FAEEDA; color: #633806; }
.db-hard   { background: #FCEBEB; color: #501313; }
.phase-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #E6F1FB; color: #0C447C; }

.messages { height: 320px; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 9px; }
.msg-ph { display: flex; align-items: center; justify-content: center; height: 100%; color: #bbb; font-size: 13px; text-align: center; padding: 2rem; }
.msg { display: flex; gap: 7px; align-items: flex-start; }
.msg.user   { flex-direction: row-reverse; }
.msg.system { justify-content: center; }
.av { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; flex-shrink: 0; }
.av.ai   { background: #E1F5EE; color: #085041; }
.av.user { background: #E6F1FB; color: #0C447C; }
.bubble { max-width: 78%; padding: 8px 12px; font-size: 13px; line-height: 1.65; }
.msg.ai   .bubble { background: #f5f5f0; border-radius: 4px 12px 12px 12px; }
.msg.user .bubble { background: #E6F1FB; border-radius: 12px 4px 12px 12px; color: #042C53; }
.msg.system   .bubble { background: #FAEEDA; border-radius: 8px; color: #633806; font-size: 12px; max-width: 96%; text-align: center; }
.msg.phase-up .bubble { background: #E6F1FB; border-radius: 8px; color: #0C447C; font-size: 12px; max-width: 96%; text-align: center; font-weight: 600; }
.msg.clear-msg .bubble { background: #E1F5EE; border-radius: 8px; color: #085041; font-size: 14px; max-width: 96%; text-align: center; font-weight: 600; }

.typing-dots { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
.typing-dots span { width: 6px; height: 6px; border-radius: 50%; background: #bbb; animation: blink 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: .2s; }
.typing-dots span:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }

.inp-row { display: flex; gap: 7px; padding: 9px 11px; border-top: 1px solid #f0f0ec; }
.inp-row textarea { flex: 1; resize: none; height: 38px; font-size: 13px; padding: 8px 11px; border-radius: 8px; border: 1px solid #ddd; background: #fff; color: #1a1a1a; font-family: inherit; line-height: 1.4; }
.inp-row textarea:focus { outline: none; border-color: #1D9E75; }
.send-btn { background: #1D9E75; color: #fff; border: none; border-radius: 8px; padding: 0 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.send-btn:hover { background: #0F6E56; }
.send-btn:disabled { background: #ddd; color: #aaa; cursor: not-allowed; }

.fb-box { background: #f5f5f0; border-radius: 10px; padding: 12px 14px; display: none; }
.fb-box.show { display: block; }
.fb-label { font-size: 11px; color: #888; margin-bottom: 6px; }
.fb-text { font-size: 13px; color: #1a1a1a; line-height: 1.8; white-space: pre-wrap; }
.fb-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.btn-save { background: #1D9E75; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-save:hover { background: #0F6E56; }
.btn-save:disabled { background: #ddd; color: #aaa; cursor: not-allowed; }
.btn-sub { background: none; border: 1px solid #ddd; border-radius: 8px; padding: 8px 14px; font-size: 12px; color: #666; cursor: pointer; font-family: inherit; }
.btn-sub:hover { background: #ebebeb; }

/* 履歴 */
.filter-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.filter-row select { font-size: 12px; padding: 6px 9px; border-radius: 8px; border: 1px solid #ddd; background: #fff; color: #1a1a1a; font-family: inherit; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
.stat-card { background: #fff; border-radius: 10px; padding: 10px; text-align: center; border: 1px solid #e4e4e0; }
.stat-val { font-size: 20px; font-weight: 700; }
.stat-lbl { font-size: 10px; color: #888; margin-top: 2px; }
.hist-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
.hist-item { background: #fff; border: 1px solid #e4e4e0; border-radius: 12px; padding: 12px 14px; cursor: pointer; transition: border-color .15s; }
.hist-item:hover { border-color: #aaa; }
.hist-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.hist-name { font-size: 13px; font-weight: 600; }
.badge { display: inline-block; padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-A { background: #E1F5EE; color: #085041; }
.badge-B { background: #FAEEDA; color: #633806; }
.badge-C { background: #FCEBEB; color: #501313; }
.hist-meta { display: flex; gap: 8px; font-size: 11px; color: #aaa; margin-bottom: 5px; flex-wrap: wrap; }
.hist-fb-preview { font-size: 12px; color: #888; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.empty { text-align: center; padding: 2.5rem; color: #bbb; font-size: 13px; }

.overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.42); z-index: 200; align-items: center; justify-content: center; padding: 16px; }
.overlay.open { display: flex; }
.detail-box { background: #fff; border-radius: 14px; padding: 20px; max-width: 460px; width: 100%; max-height: 85vh; overflow-y: auto; }
.detail-box h3 { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
.dc { font-size: 12px; line-height: 1.6; padding: 7px 11px; border-radius: 8px; margin-bottom: 6px; }
.dc.customer { background: #f5f5f0; }
.dc.staff { background: #E6F1FB; color: #042C53; }
.dc-label { font-size: 10px; color: #aaa; margin-bottom: 2px; }
.detail-fb { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0ec; }
</style>
</head>
<body>

<header class="site-header">
  <div class="logo">🎓</div>
  <div>
    <h1>KyoSai Academy</h1>
    <p>代理店見込みメンバー ロールプレイ練習</p>
  </div>
</header>

<div class="container">
  <div class="tabs">
    <button class="tab-btn active" onclick="switchTab('practice')">練習する</button>
    <button class="tab-btn" onclick="switchTab('history')">履歴・成績</button>
  </div>

  <div id="tab-practice">
    <div class="staff-row">
      <label>スタッフ名</label>
      <input id="staffName" placeholder="名前を入力してください" />
    </div>
    <div class="diff-row">
      <label>難易度</label>
      <button class="diff-btn active-easy"  id="diff-easy"   onclick="setDiff('easy')"  >🟢 やさしい</button>
      <button class="diff-btn"              id="diff-normal" onclick="setDiff('normal')" >🟡 普通</button>
      <button class="diff-btn"              id="diff-hard"   onclick="setDiff('hard')"   >🔴 難しい</button>
    </div>

    <div class="sc-grid" id="scGrid"></div>

    <!-- フェーズバー -->
    <div class="phase-bar" id="phaseBar">
      <div class="phase-bar-title">進行フェーズ</div>
      <div class="phase-steps">
        <div class="phase-step active" id="ps-0">
          <div class="ps-circle">1</div>
          <div class="ps-label">ニーズ取り<br>現状・悩みを聞く</div>
        </div>
        <div class="phase-step" id="ps-1">
          <div class="ps-circle">2</div>
          <div class="ps-label">展開<br>興味・関心を広げる</div>
        </div>
        <div class="phase-step" id="ps-2">
          <div class="ps-circle">3</div>
          <div class="ps-label">クロージング<br>アポ・面談の約束</div>
        </div>
      </div>
      <div class="phase-hint" id="phaseHint"></div>
    </div>

    <div class="chat-box">
      <div class="chat-head">
        <span class="ch-name" id="chName">シナリオを選んでください</span>
        <div class="ch-meta">
          <span class="phase-badge" id="phaseBadge" style="display:none"></span>
          <span class="diff-badge"  id="diffBadge"></span>
          <span class="ch-turn"     id="chTurn"></span>
        </div>
      </div>
      <div class="messages" id="messages">
        <div class="msg-ph">上のカードを選ぶとスタートします</div>
      </div>
      <div class="inp-row">
        <textarea id="userInput" placeholder="シナリオを選んでください" disabled></textarea>
        <button class="send-btn" id="sendBtn" onclick="sendMsg()" disabled>送信</button>
      </div>
    </div>

    <div class="fb-box" id="fbBox">
      <div class="fb-label">AIフィードバック（3フェーズ評価）</div>
      <div class="fb-text" id="fbText"></div>
      <div class="fb-actions">
        <button class="btn-save" id="saveBtn" onclick="saveRecord()">履歴に保存</button>
        <button class="btn-sub"  onclick="getFeedback()">再評価</button>
      </div>
    </div>
  </div>

  <div id="tab-history" style="display:none">
    <div class="filter-row">
      <select id="filterStaff" onchange="renderHistory()"><option value="">全スタッフ</option></select>
      <select id="filterSc"    onchange="renderHistory()"><option value="">全シナリオ</option></select>
      <select id="filterDiff"  onchange="renderHistory()">
        <option value="">全難易度</option>
        <option value="easy">🟢 やさしい</option>
        <option value="normal">🟡 普通</option>
        <option value="hard">🔴 難しい</option>
      </select>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-val" id="stTotal">0</div><div class="stat-lbl">総練習回数</div></div>
      <div class="stat-card"><div class="stat-val" id="stStaff">0</div><div class="stat-lbl">参加スタッフ数</div></div>
      <div class="stat-card"><div class="stat-val" id="stClear">0</div><div class="stat-lbl">クリア数</div></div>
      <div class="stat-card"><div class="stat-val" id="stAvg">-</div><div class="stat-lbl">平均評価</div></div>
    </div>
    <div class="hist-list" id="histList"><div class="empty">まだ練習履歴がありません</div></div>
  </div>
</div>

<div class="overlay" id="overlay" onclick="closeOverlay(event)">
  <div class="detail-box">
    <h3 id="detailTitle"></h3>
    <div id="detailConv"></div>
    <div class="detail-fb">
      <div class="fb-label">フィードバック</div>
      <div class="fb-text" id="detailFb"></div>
    </div>
    <div class="fb-actions" style="margin-top:14px">
      <button class="btn-sub" onclick="document.getElementById('overlay').classList.remove('open')">閉じる</button>
    </div>
  </div>
</div>

<script>
/* ═══ 定数 ═══ */
const PHASES = [
  {
    id: 0, name: "ニーズ取り",
    badge: "① ニーズ取り",
    hint: "<strong>やること：</strong>現状・悩みをオープン質問で聞く。「今どんな状況ですか？」「収入面で気になっていることはありますか？」など。<br>→ 相手がある程度話したら フェーズ2へ進もう",
    keywords: ["今どんな","現在","今の状況","悩み","困って","収入","仕事","生活","将来","不安"],
  },
  {
    id: 1, name: "展開",
    badge: "② 展開",
    hint: "<strong>やること：</strong>ニーズに合わせて代理店の魅力を伝える。「実はこういう方が多いんですよね」「それで言うと〇〇さんにぴったりかもしれません」など。<br>→ 相手の興味が高まったら クロージングへ",
    keywords: ["実は","それで言うと","ぴったり","向いてる","できますよ","可能です","稼げます","自由","やりがい","実績"],
  },
  {
    id: 2, name: "クロージング",
    badge: "③ クロージング",
    hint: "<strong>やること：</strong>アポ・面談の約束を取る。「一度、詳しい担当者とお話しする機会を作ってもよいですか？」「来週お時間はありますか？」など。",
    keywords: ["担当","アドバイザー","お繋ぎ","面談","お話しする","機会","時間","来週","いつ","アポ","約束","会いましょう"],
  }
];

const CLOSE_WORDS = ["わかりました","聞いてみます","話を聞いてみます","お願いします","聞きます","ぜひ","会いましょう","大丈夫です","いいですよ","検討します","前向き"];

const DIFF_CONFIG = {
  easy: {
    label:"🟢 やさしい", cls:"db-easy", minPhase1:1, minPhase2:1,
    mod:`・見込みメンバーは前向きで話しやすい\n・1〜2往復の質問でニーズを話してくれる\n・展開フェーズでも興味を持ちやすい\n・クロージングには比較的すんなり応じる`
  },
  normal: {
    label:"🟡 普通", cls:"db-normal", minPhase1:2, minPhase2:2,
    mod:`・見込みメンバーは少し慎重で疑問も多め\n・ニーズを引き出すには2〜3往復の質問が必要\n・展開では「本当に？」「具体的には？」と掘り下げてくる\n・クロージングは1回では応じず、もう一押し必要`
  },
  hard: {
    label:"🔴 難しい", cls:"db-hard", minPhase1:3, minPhase2:3,
    mod:`・見込みメンバーは懐疑的で警戒心が強い\n・ニーズを話してもらうまで3往復以上の丁寧な質問が必要\n・展開では「怪しくないか」「本当に稼げるのか」と強く疑問を持つ\n・クロージングは2〜3回は断り、強い理由がないと応じない\n・曖昧な説明や押し売り感があると強く引く`
  }
};

const SCS = [
  {
    name:"副業したいサラリーマン", icon:"👔", attr:"30〜40代・男性",
    needs:"収入を増やしたいが会社バレと時間不足が不安",
    basePrompt:`あなたは副業に興味を持ったサラリーマン・中村さん（35歳男性）を演じてください。
本業があり収入を増やしたいが「会社にバレないか」「時間がないのに本当にできるのか」「怪しくないか」という不安が強い。
売り込みっぽいトークは嫌い。具体的な話や実績を見せてもらえると前向きになる。
日本語のみで応答してください。`,
    first:`友人から代理店の話を聞いたんですが…副業でもできるんですか？本業があるので時間があまりなくて。`
  },
  {
    name:"子が小さい主婦", icon:"👶", attr:"30代・女性",
    needs:"家計を助けたいが自己不信と両立不安がある",
    basePrompt:`あなたは子育て中の主婦・田中さん（32歳・子ども2歳）を演じてください。
家計を助けたいが「自分にできるのか」「子どもが小さいのに仕事できるか」という自己不信と不安が強い。
押し付けられると引いてしまう。「私でもできそう」と思えたら前向きになる。
日本語のみで応答してください。`,
    first:`代理店のお仕事って子育て中でもできるんですか？子どもがまだ小さくて…私みたいな人でもできるのかなって。`
  },
  {
    name:"中高生ママ", icon:"🎒", attr:"40代・女性",
    needs:"教育費が心配。MLM疑念と知人への売り込み不安がある",
    basePrompt:`あなたは主婦・佐藤さん（43歳・子ども中学生）を演じてください。
教育費のために収入を増やしたい。「ネットワークビジネスじゃないか」「知人に売り込まないといけないのでは」という疑念がある。
疑念が解消されれば前向きになれる。
日本語のみで応答してください。`,
    first:`代理店って具体的にどんな仕事なんですか？パートより稼げると聞いたんですが、ネットワークビジネスとは違うんですよね？`
  },
  {
    name:"50代・子育て卒業", icon:"🌸", attr:"50代・女性",
    needs:"やりがいと自分らしい働き方を求めている",
    basePrompt:`あなたは鈴木さん（54歳女性・子ども独立済み）を演じてください。
子育てが終わり時間ができた。お金より「やりがい」「誰かの役に立つこと」「自分らしく働くこと」を重視。
「今さら新しいことができるか」という不安がある。「自分らしくできる」と感じれば前向きになる。
日本語のみで応答してください。`,
    first:`子どもも独立して時間ができたんですが…代理店って、どんな人が向いているんでしょうか？`
  },
  {
    name:"安定してる経営者", icon:"🏆", attr:"40〜50代・男性",
    needs:"既存事業との相乗効果と信頼性を重視",
    basePrompt:`あなたは経営者・橋本さん（48歳・自社事業は好調）を演じてください。
新しい収益の柱を探して代理店に興味を持った。「既存事業との相乗効果があるか」「手間がかかりすぎないか」「信頼できる組織か」を重視。
薄い話や曖昧な返答を嫌い、具体的・論理的な説明を求める。納得できれば判断は早い。
日本語のみで応答してください。`,
    first:`代理店の話、少し聞かせてもらえますか。今の事業と組み合わせてやれるのかどうか、そこが一番知りたいんですが。`
  },
  {
    name:"事業を探してる経営者", icon:"🔍", attr:"40代・男性",
    needs:"今の事業に行き詰まり、失敗したくないという慎重さがある",
    basePrompt:`あなたは経営者・木村さん（42歳・今の事業が苦しい）を演じてください。
事業の先行きに不安があり新しいビジネスを探している。「また失敗したくない」「本当に稼げるのか」「どれくらいで結果が出るか」という慎重な姿勢。
実績や具体的な数字を見せてもらえると信頼度が上がる。
日本語のみで応答してください。`,
    first:`正直に言うと、今の事業がうまくいってなくて…代理店ビジネスって、実際どのくらい稼げるものなんですか？`
  }
];

const STORAGE_KEY = "kyosai-v4";

/* ═══ 状態 ═══ */
let selSc = null, curDiff = "easy";
let apiMsgs = [], turnCount = 0, curPhase = 0;
let phase1Done = false, phase2Done = false, cleared = false;
let phase1Turns = 0, phase2Turns = 0;
let curFb = "";
let histCache = [];

/* ═══ 初期化 ═══ */
(function init() {
  const grid = document.getElementById("scGrid");
  grid.innerHTML = SCS.map((s, i) => `
    <div class="sc-card" id="sc-${i}" onclick="selectSc(${i})">
      <div class="sc-icon">${s.icon}</div>
      <div class="sc-name">${s.name}</div>
      <div class="sc-attr">${s.attr}</div>
      <div class="sc-tag">${s.needs}</div>
    </div>`).join("");
  const fsc = document.getElementById("filterSc");
  SCS.forEach((s, i) => {
    const o = document.createElement("option");
    o.value = i; o.textContent = s.name; fsc.appendChild(o);
  });
})();

/* ═══ 難易度 ═══ */
function setDiff(d) {
  curDiff = d;
  ["easy","normal","hard"].forEach(x => {
    const b = document.getElementById("diff-" + x);
    b.className = "diff-btn" + (x === d ? " active-" + x : "");
  });
  if (selSc !== null) selectSc(selSc);
}

/* ═══ フェーズUI更新 ═══ */
function updatePhaseUI(phase) {
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById("ps-" + i);
    el.className = "phase-step" + (i < phase ? " done" : i === phase ? " active" : "");
  }
  const pb = document.getElementById("phaseBadge");
  pb.textContent = PHASES[phase].badge;
  pb.style.display = "";
  document.getElementById("phaseHint").innerHTML = PHASES[phase].hint;
}

/* ═══ シナリオ選択 ═══ */
function selectSc(id) {
  selSc = id; apiMsgs = []; turnCount = 0; curPhase = 0;
  phase1Done = false; phase2Done = false; cleared = false;
  phase1Turns = 0; phase2Turns = 0; curFb = "";

  document.querySelectorAll(".sc-card").forEach(c => c.classList.remove("active"));
  document.getElementById("sc-" + id).classList.add("active");

  const cfg = DIFF_CONFIG[curDiff];
  document.getElementById("chName").textContent = SCS[id].icon + " " + SCS[id].name + "（" + SCS[id].attr + "）";
  const db = document.getElementById("diffBadge");
  db.textContent = cfg.label; db.className = "diff-badge " + cfg.cls;
  document.getElementById("chTurn").textContent = "";
  document.getElementById("userInput").disabled = false;
  document.getElementById("userInput").placeholder = "スタッフとして話しかけてください...";
  document.getElementById("sendBtn").disabled = false;
  document.getElementById("fbBox").classList.remove("show");
  document.getElementById("messages").innerHTML = "";
  document.getElementById("phaseBar").classList.add("show");
  updatePhaseUI(0);

  appendMsg("ai", SCS[id].first);

  const sys = `${SCS[id].basePrompt}

【難易度設定】
${cfg.mod}

【フェーズ設定】
会話は3フェーズで進む。現在フェーズ1（ニーズ取り）。
・フェーズ1：スタッフが現状・悩みをオープン質問で聞いてくる。あなたは自分の状況や悩みを少しずつ話す。
・フェーズ2：スタッフが代理店の魅力や可能性を伝えてくる。あなたは興味・疑問を示す。
・フェーズ3：スタッフが面談・アポを打診してくる。難易度に応じて応じ方を変える。
自然な対話として、相手の発言に合わせてリアクションしてください。`;

  apiMsgs.push({ role: "user", content: sys });
  apiMsgs.push({ role: "assistant", content: SCS[id].first });
}

/* ═══ フェーズ検知 ═══ */
function detectPhase(txt) {
  const cfg = DIFF_CONFIG[curDiff];

  if (curPhase === 0) {
    // フェーズ1キーワード or 一定往復でフェーズ2へ
    const hasP1 = PHASES[0].keywords.some(w => txt.includes(w));
    if (hasP1) phase1Turns++;
    if (phase1Turns >= cfg.minPhase1 && !phase1Done) {
      phase1Done = true;
      return 1; // フェーズ2へ
    }
  } else if (curPhase === 1) {
    const hasP2 = PHASES[1].keywords.some(w => txt.includes(w));
    if (hasP2) phase2Turns++;
    if (phase2Turns >= cfg.minPhase2 && !phase2Done) {
      phase2Done = true;
      return 2; // フェーズ3へ
    }
  }
  return curPhase;
}

/* ═══ メッセージ送信 ═══ */
async function sendMsg() {
  const inp = document.getElementById("userInput");
  const txt = inp.value.trim();
  if (!txt || selSc === null || cleared) return;
  inp.value = "";
  document.getElementById("sendBtn").disabled = true;
  appendMsg("user", txt);
  turnCount++;
  document.getElementById("chTurn").textContent = turnCount + "往復";

  // フェーズ進行チェック
  const nextPhase = detectPhase(txt);
  if (nextPhase !== curPhase) {
    curPhase = nextPhase;
    updatePhaseUI(curPhase);
    const phaseNames = ["ニーズ取り","展開","クロージング"];
    appendMsg("phase-up", `📍 フェーズ${curPhase + 1}「${phaseNames[curPhase]}」へ進みました！`);
    // システムメッセージをAPIに追加
    apiMsgs.push({ role: "user", content: `[システム：会話はフェーズ${curPhase + 1}（${phaseNames[curPhase]}）に入りました。対応を切り替えてください。]` });
    apiMsgs.push({ role: "assistant", content: `（フェーズ${curPhase + 1}に移行）` });
  }

  // クロージングワード検知
  const hasClose = PHASES[2].keywords.some(w => txt.includes(w));

  apiMsgs.push({ role: "user", content: txt });
  showTyping();

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: apiMsgs[0].content,
        messages: apiMsgs.slice(1).filter(m => m.content !== "（フェーズ2に移行）" && m.content !== "（フェーズ3に移行）")
      })
    });
    const data = await res.json();
    const rep = data.content?.[0]?.text || "（応答なし）";
    removeTyping();
    appendMsg("ai", rep);
    apiMsgs.push({ role: "assistant", content: rep });

    // クリア判定
    if (curPhase === 2 && hasClose) {
      const accepted = CLOSE_WORDS.some(w => rep.includes(w));
      if (accepted) {
        cleared = true;
        setTimeout(() => {
          appendMsg("clear-msg", "🎉 クリア！アポ獲得成功！3フェーズを制覇しました！");
          document.getElementById("fbBox").classList.add("show");
          getFeedback();
        }, 600);
        document.getElementById("sendBtn").disabled = false;
        return;
      }
    }

    // 8往復超えてもクリアしてなければフィードバック
    if (!cleared && turnCount >= 8) {
      document.getElementById("fbBox").classList.add("show");
      if (!curFb) getFeedback();
    }
  } catch {
    removeTyping();
    appendMsg("ai", "（エラーが発生しました。時間をおいて再試行してください）");
  }
  document.getElementById("sendBtn").disabled = false;
}

document.getElementById("userInput").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});

/* ═══ フィードバック ═══ */
async function getFeedback() {
  document.getElementById("fbText").textContent = "3フェーズを分析中...";
  const sc = SCS[selSc], cfg = DIFF_CONFIG[curDiff];
  const conv = apiMsgs.slice(1)
    .filter(m => !m.content.startsWith("[システム"))
    .map(m => (m.role === "user" ? "スタッフ" : "見込みメンバー") + ": " + m.content)
    .join("\n");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1000,
        messages: [{ role: "user", content:
`共済代理店スタッフが「代理店見込みメンバー」に対して行った3フェーズのロールプレイを評価してください。

シナリオ：${sc.name}（${sc.attr}）
難易度：${cfg.label}
到達フェーズ：フェーズ${curPhase + 1}（${PHASES[curPhase].name}）
クリア：${cleared ? "✅ アポ獲得成功" : "❌ 未達成"}

以下の形式で日本語回答：
【① ニーズ取り】現状・悩みをうまく引き出せたか。良かった点または改善点を1文
【② 展開】代理店の魅力・可能性をニーズに合わせて伝えられたか。良かった点または改善点を1文
【③ クロージング】${cleared ? "アポをどのように取ったか評価を1文" : "まだアポが取れていない。次にどう切り出すべきか具体的なアドバイスを1文"}
【次回やってみること】この見込みタイプに効果的なフレーズ例を1つ含めて1〜2文
【総合評価】A・B・Cのいずれか1文字

会話：
${conv}` }]
      })
    });
    const data = await res.json();
    curFb = data.content?.[0]?.text || "";
    document.getElementById("fbText").textContent = curFb;
  } catch {
    document.getElementById("fbText").textContent = "取得失敗。時間をおいて再試行してください。";
  }
}

/* ═══ 保存 ═══ */
function saveRecord() {
  const name = document.getElementById("staffName").value.trim();
  if (!name) { alert("スタッフ名を入力してください"); return; }
  if (!curFb) { alert("まずフィードバックを取得してください"); return; }
  document.getElementById("saveBtn").disabled = true;
  const grade = curFb.includes("総合評価】A") ? "A" : curFb.includes("総合評価】B") ? "B" : "C";
  const conv = apiMsgs.slice(1)
    .filter(m => !m.content.startsWith("[システム") && !m.content.startsWith("（フェーズ"))
    .map(m => ({ role: m.role === "user" ? "staff" : "member", text: m.content }));
  const rec = {
    id: Date.now(), staff: name,
    scId: selSc, scName: SCS[selSc].name, attr: SCS[selSc].attr,
    diff: curDiff, diffLabel: DIFF_CONFIG[curDiff].label,
    turns: turnCount, reachedPhase: curPhase + 1, cleared, grade, feedback: curFb, conv,
    date: new Date().toLocaleDateString("ja-JP")
  };
  const list = loadLocal(); list.unshift(rec); saveLocal(list);
  alert("✅ 保存しました！");
  document.getElementById("saveBtn").disabled = false;
}

/* ═══ ストレージ ═══ */
function loadLocal() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveLocal(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

/* ═══ タブ ═══ */
function switchTab(t) {
  document.querySelectorAll(".tab-btn").forEach((b, i) =>
    b.classList.toggle("active", ["practice","history"][i] === t));
  document.getElementById("tab-practice").style.display = t === "practice" ? "" : "none";
  document.getElementById("tab-history").style.display  = t === "history"  ? "" : "none";
  if (t === "history") { loadAndRenderHistory(); }
}

/* ═══ 履歴 ═══ */
function loadAndRenderHistory() { histCache = loadLocal(); updateStaffFilter(); renderHistory(); }
function updateStaffFilter() {
  const names = [...new Set(histCache.map(r => r.staff))];
  const sel = document.getElementById("filterStaff"); const cur = sel.value;
  sel.innerHTML = '<option value="">全スタッフ</option>' +
    names.map(n => `<option value="${n}"${n===cur?" selected":""}>${n}</option>`).join("");
}
function renderHistory() {
  const fS  = document.getElementById("filterStaff").value;
  const fSc = document.getElementById("filterSc").value;
  const fD  = document.getElementById("filterDiff").value;
  const f = histCache.filter(r =>
    (!fS || r.staff === fS) && (fSc === "" || r.scId == fSc) && (!fD || r.diff === fD));
  document.getElementById("stTotal").textContent = f.length;
  document.getElementById("stStaff").textContent = new Set(f.map(r => r.staff)).size;
  document.getElementById("stClear").textContent = f.filter(r => r.cleared).length;
  const gs = f.map(r => r.grade === "A" ? 3 : r.grade === "B" ? 2 : 1);
  const avg = gs.length ? gs.reduce((a,b)=>a+b,0)/gs.length : 0;
  document.getElementById("stAvg").textContent = avg ? ["C","B","A"][Math.round(avg)-1]||"-" : "-";
  const el = document.getElementById("histList");
  if (!f.length) { el.innerHTML = '<div class="empty">履歴がありません</div>'; return; }
  window._fh = f;
  el.innerHTML = f.map((r,i) => `
    <div class="hist-item" onclick="openDetail(${i})">
      <div class="hist-top"><span class="hist-name">${r.staff}</span><span class="badge badge-${r.grade}">評価 ${r.grade}</span></div>
      <div class="hist-meta">
        <span>${r.scName}</span><span>${r.diffLabel||""}</span>
        <span>F${r.reachedPhase||"?"}</span><span>${r.turns}往復</span>
        <span>${r.cleared?"✅クリア":"練習中"}</span><span>${r.date}</span>
      </div>
      <div class="hist-fb-preview">${r.feedback}</div>
    </div>`).join("");
}
function openDetail(i) {
  const r = (window._fh||[])[i]; if(!r)return;
  document.getElementById("detailTitle").textContent = `${r.staff} ｜ ${r.scName}（${r.date}）`;
  document.getElementById("detailConv").innerHTML = (r.conv||[]).map(c=>`
    <div class="dc ${c.role==="staff"?"staff":"customer"}">
      <div class="dc-label">${c.role==="staff"?"スタッフ":"見込みメンバー"}</div>${c.text}
    </div>`).join("");
  document.getElementById("detailFb").textContent = r.feedback;
  document.getElementById("overlay").classList.add("open");
}
function closeOverlay(e) { if(e.target===document.getElementById("overlay")) document.getElementById("overlay").classList.remove("open"); }

/* ═══ UIヘルパー ═══ */
function appendMsg(role, text) {
  const c = document.getElementById("messages");
  const ph = c.querySelector(".msg-ph"); if(ph) ph.remove();
  const d = document.createElement("div");
  d.className = "msg " + role;
  if (["system","phase-up","clear-msg"].includes(role)) {
    d.innerHTML = `<div class="bubble">${text}</div>`;
  } else {
    const label = role === "ai" ? "相手" : "あなた";
    d.innerHTML = `<div class="av ${role}">${label}</div><div class="bubble">${text}</div>`;
  }
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}
function showTyping() {
  const c = document.getElementById("messages");
  const d = document.createElement("div"); d.className="msg ai"; d.id="typing";
  d.innerHTML=`<div class="av ai">相手</div><div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  c.appendChild(d); c.scrollTop=c.scrollHeight;
}
function removeTyping() { const e=document.getElementById("typing"); if(e) e.remove(); }
</script>
</body>
</html>
