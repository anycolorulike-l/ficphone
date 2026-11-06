/* Editor translations keyed by the existing English source labels. */
window.FicPhoneLocales={ko:{},ja:{}};
(()=>{const rows=`
Jua · Rounded Korean|Jua · 둥근 글꼴|Jua · 丸い韓国語
Gamja Flower · Handwritten Korean|Gamja Flower · 손글씨|Gamja Flower · 韓国語の手書き
Yomogi · Handwritten Japanese|Yomogi · 일본어 손글씨|Yomogi · 日本語の手書き
ZCOOL KuaiLe · Playful Chinese|站酷快乐体 · 발랄한 중국어|站酷快乐体 · ポップな中国語
Suggestions board|의견 게시판|ご意見ボード
Edit character|캐릭터 편집|キャラクターを編集
Default avatar|기본 프로필 사진|共通アイコン
Platform display name (optional)|플랫폼 표시 이름 (선택)|プラットフォームの表示名（任意）
Platform username (optional)|플랫폼 계정 (선택)|プラットフォームのアカウント（任意）
Platform avatar (optional)|플랫폼 프로필 사진 (선택)|プラットフォームのアイコン（任意）
Leave blank for defaults. Usernames are fictional display data; no platform connection.|비우면 기본 자료를 사용합니다. 작품에만 표시되며 실제 플랫폼과 연결하지 않습니다.|空欄なら共通設定を使います。作品内の表示のみで実際のサービスには接続しません。
Profiles are included in JSON backups. Each platform can override the defaults; applying a profile does not rewrite story text.|자료는 JSON에 포함됩니다. 플랫폼별로 설정할 수 있으며 본문은 바뀌지 않습니다.|資料はJSONに保存されます。プラットフォーム別に設定でき、本文は書き換えません。
Custom albums|사용자 지정 앨범|カスタムアルバム
Photos may belong to multiple albums. Deleting an album keeps its photos.|사진은 여러 앨범에 넣을 수 있습니다. 앨범을 삭제해도 사진은 남습니다.|写真は複数のアルバムに追加できます。アルバムを削除しても写真は残ります。
Album name|앨범 이름|アルバム名
New album|새 앨범|アルバムを作成
Delete album (keep photos)|앨범 삭제 (사진 유지)|アルバムを削除（写真は保持）
Privacy & data|개인정보 및 데이터|プライバシーとデータ
Copyright & materials|저작권 및 자료|著作権と素材
This browser only · Export JSON backups regularly|이 브라우저에만 저장 · JSON을 정기적으로 백업하세요|このブラウザのみ・定期的にJSONを保存
Save a JSON project backup|JSON 프로젝트 백업|JSONプロジェクトを保存
If downloads are blocked, save each image separately. PNG is a finished image; save JSON to keep editing.|다운로드가 차단되면 개별 저장하세요. PNG는 완성본이며 재편집하려면 JSON을 보관하세요.|ダウンロードが制限されたら個別に保存します。PNGは完成品です。再編集にはJSONを保存してください。
Interface language|편집기 언어|編集画面の言語
System default|시스템 설정|システムに合わせる
Projects|프로젝트|プロジェクト
Characters|캐릭터|キャラクター
Export check|내보내기 점검|書き出し前チェック
User guide|사용 안내|使い方
Feedback|의견 보내기|フィードバック
Undo|실행 취소|元に戻す
Redo|다시 실행|やり直す
Play demo|예시 체험|デモを体験
TWICE demo|TWICE 예시|TWICE サンプル
Import project|프로젝트 가져오기|プロジェクトを読み込む
Back up project|프로젝트 백업|プロジェクトを保存
Screenshots|스크린샷 제작|スクリーンショット
Interactive phone|인터랙티브 휴대폰|インタラクティブなスマホ
Choose a template, edit and export|템플릿을 골라 편집하고 내보내세요|テンプレートを選び、編集して書き出します
Build an explorable phone story|탐색할 수 있는 휴대폰 이야기를 만드세요|探索できるスマホの物語を作ります
Templates|템플릿|テンプレート
Phone & content|휴대폰과 콘텐츠|スマホとコンテンツ
Appearance|휴대폰 꾸미기|スマホの外観
Apps|앱|アプリ
App content|앱 콘텐츠|アプリの内容
Photos & notes|사진과 메모|写真とメモ
Story events|스토리 트리거|物語のトリガー
Project title|프로젝트 제목|プロジェクト名
Phone owner|휴대폰 주인|スマホの持ち主
Contact name|상대방 이름|相手の表示名
Contact avatar|상대방 프로필 사진|相手のアイコン
Remove image|이미지 삭제|画像を削除
Chat script|대화 스크립트|会話スクリプト
Append my message|내 메시지 추가|自分のメッセージを追加
Conversation title (optional)|대화방 이름 (선택)|会話名（任意）
Group members (up to 9 including owner)|그룹 멤버 (주인 포함 최대 9명)|グループメンバー（持ち主を含め最大9人）
Add member|멤버 추가|メンバーを追加
Member name|멤버 이름|メンバー名
Member avatar|멤버 프로필 사진|メンバーのアイコン
Remove member|멤버 삭제|メンバーを削除
Last message read by this member|이 멤버가 읽은 마지막 메시지 번호|このメンバーが既読にした最後のメッセージ番号
Date separator|날짜 구분 표시|日付の区切り
Default message time|기본 메시지 시간|メッセージの既定時刻
My messages are unread|내 메시지가 아직 읽히지 않음|自分のメッセージを未読にする
Unread from (0 = after the last incoming reply)|미읽음 시작 번호 (0 = 상대방의 마지막 답장 이후)|未読の開始位置（0＝相手の最後の返信以降）
Incoming unread count|대화 목록의 미읽음 수|会話一覧の未読件数
Show typing (animated in reader, static in PNG)|입력 상태 표시 (독자 화면은 애니메이션, PNG는 정지)|入力中を表示（読者画面はアニメ、PNGは静止）
Message after typing (optional)|입력 후 도착할 메시지 (선택)|入力後に届くメッセージ（任意）
Typing duration in seconds (1–30)|입력 시간 (1~30초)|入力中の秒数（1〜30）
Device preset|기기 프리셋|端末プリセット
Phone language & default app names|휴대폰 언어 및 기본 앱 이름|スマホの言語・既定のアプリ名
Status bar time|상태 표시줄 시간|ステータスバーの時刻
Battery %|배터리 %|バッテリー %
Battery mode|배터리 상태|バッテリーの状態
Normal|일반|通常
Low power|저전력 모드|低電力モード
Charging|충전 중|充電中
Hide Dynamic Island / camera cutout|다이내믹 아일랜드 / 카메라 구멍 숨기기|Dynamic Island／カメラ穴を隠す
Work font|작품 글꼴|作品のフォント
System font|시스템 기본|システム標準
Serif|명조체|セリフ体
Monospace|고정폭 글꼴|等幅フォント
Work text size|작품 글자 크기|作品の文字サイズ
Small|작게|小
Standard|보통|標準
Large|크게|大
Author credit (optional)|작가 서명 (선택)|作者名（任意）
Watermark screenshots|스크린샷에 작가 워터마크 추가|画像に作者名の透かしを入れる
Show author credit in interactive HTML|인터랙티브 HTML에 작가 이름 표시|インタラクティブHTMLに作者名を表示
Show device frame in preview (excluded from PNG)|미리보기에 기기 테두리 표시 (PNG에는 제외)|プレビューに端末枠を表示（PNGには含まれません）
Chat screenshot|대화 스크린샷|会話のスクリーンショット
Social screenshot|SNS 스크린샷|SNSのスクリーンショット
Screenshot preview|스크린샷 미리보기|画像プレビュー
Reader preview|독자 미리보기|読者プレビュー
Restart preview|다시 체험|最初から試す
Export screenshot ZIP|스크린샷 ZIP 내보내기|画像をZIPで書き出す
Export screen PNG|한 화면 PNG 내보내기|1画面のPNGを書き出す
Export long PNG|긴 이미지 내보내기|縦長画像を書き出す
Export pages|페이지별 내보내기|ページごとに書き出す
Export interactive HTML|인터랙티브 HTML 내보내기|インタラクティブHTMLを書き出す
View home screen|홈 화면 보기|ホーム画面を見る
Story test log|스토리 테스트 기록|物語のテスト記録
Duplicate sheet|복제하여 새 화면|画面を複製
Move left|왼쪽으로|左へ
Move right|오른쪽으로|右へ
Delete sheet|현재 화면 삭제|現在の画面を削除
Conversation / post|대화 / 게시물|会話／投稿
Duplicate conversation / post|대화 / 게시물 복제|会話／投稿を複製
Delete item|이 항목 삭제|この項目を削除
Edit individual messages & times|메시지와 시간 개별 편집|メッセージと時刻を個別編集
Sender|보낸 사람|送信者
Time|시간|時刻
Message|메시지|メッセージ
Delete message|메시지 삭제|メッセージを削除
Images (up to 9; use [图片] in chat to insert)|이미지 (최대 9장, 대화에는 [图片] 입력)|画像（最大9枚、会話には [图片] で挿入）
Legacy image (kept for compatibility)|이전 버전 이미지 (호환성 유지)|旧版の画像（互換性のため保持）
Username|사용자 이름|ユーザー名
Author avatar|작성자 프로필 사진|投稿者のアイコン
Body|본문|本文
Comments / replies|댓글 / 답글|コメント／返信
Post time|게시 시간|投稿日時
Likes|좋아요 수|いいね数
Reposts|재게시 수|リポスト数
Bio|소개|プロフィール
Followers|팔로워 수|フォロワー数
Following|팔로잉 수|フォロー数
Display name|표시 이름|表示名
theqoo board|더쿠 게시판|theqoo 掲示板
Category (e.g. 잡담)|분류 (예: 잡담)|カテゴリ（例：잡담）
Post title|게시물 제목|投稿タイトル
Post author|작성자 이름|投稿者名
Views|조회 수|閲覧数
Lock screen date|잠금 화면 날짜|ロック画面の日付
Lock screen introduction|잠금 화면 소개|ロック画面の紹介文
Home wallpaper|홈 화면 배경|ホーム画面の壁紙
Lock wallpaper|잠금 화면 배경|ロック画面の壁紙
Home wallpaper horizontal position %|홈 배경 가로 위치 %|ホーム壁紙の横位置 %
Home wallpaper vertical position %|홈 배경 세로 위치 %|ホーム壁紙の縦位置 %
Lock wallpaper horizontal position %|잠금 배경 가로 위치 %|ロック壁紙の横位置 %
Lock wallpaper vertical position %|잠금 배경 세로 위치 %|ロック壁紙の縦位置 %
Home wallpaper zoom (100–200%)|홈 배경 확대 (100~200%)|ホーム壁紙の拡大率（100〜200%）
Lock wallpaper zoom (100–200%)|잠금 배경 확대 (100~200%)|ロック壁紙の拡大率（100〜200%）
Default app name language|기본 앱 이름 언어|既定のアプリ名の言語
Restore default Dock|기본 Dock 복원|既定のDockに戻す
Enable app|앱 사용|アプリを有効にする
Initially locked; unlock through story|시작 시 잠금, 스토리로 해제|開始時はロック、物語で解除
Place in Dock|하단 Dock에 배치|Dockに配置
App name language|앱 이름 언어|アプリ名の言語
Use phone language|휴대폰 언어 따르기|スマホの言語に合わせる
Custom name (leave blank for default)|사용자 지정 이름 (비우면 기본값)|表示名（空欄で既定名）
Built-in icon|기본 아이콘|内蔵アイコン
Match device automatically|기기에 맞게 자동 선택|端末に自動で合わせる
Upload icon (overrides preset)|아이콘 업로드 (우선 사용)|アイコンをアップロード（優先）
Open on tap|누르면 열기|タップ時に開く
Decoration only|장식 전용|装飾のみ
Add custom icon|사용자 지정 아이콘 추가|カスタムアイコンを追加
Main chat app|주요 대화 앱|メインのチャットアプリ
Edit content|내용 편집|内容を編集
Call history|통화 기록|通話履歴
Calendar events|일정|カレンダーの予定
Photos (up to 50)|사진 (최대 50장)|写真（最大50枚）
Photo caption|사진 설명|写真の説明
Notes|메모|メモ
Title|제목|タイトル
Modified date|수정 날짜|更新日時
Remove note|메모 삭제|メモを削除
Add note|메모 추가|メモを追加
Clear photos|사진 비우기|写真をすべて削除
Legacy hidden note after photo trigger|사진 트리거 후 숨겨진 메모 (이전 방식)|写真トリガー後の隠しメモ（旧方式）
Reader hints|독자 힌트|読者向けヒント
No hints|힌트 제공 안 함|ヒントなし
Optional hints, open only when requested|독자가 누르면 힌트 표시|読者が押したときにヒントを表示
Optional hints, initially on|선택형 힌트|任意のヒント
Connect clues into a story|단서를 연결해 이야기 만들기|手がかりをつないで物語に
Enable story flow|스토리 흐름 사용|物語の進行を有効にする
Load 13-step demo|13단계 예시 불러오기|13ステップの例を読み込む
Add step|단계 추가|ステップを追加
Step title|단계 이름|ステップ名
Gentle hint for this step|이 단계의 가벼운 힌트|このステップの軽いヒント
Further hint|추가 힌트|詳しいヒント
Trigger|트리거 행동|トリガーとなる行動
Target content|대상 콘텐츠|対象のコンテンツ
Delay after trigger (seconds, 0–60)|트리거 후 지연 (0~60초)|発動後の待ち時間（0〜60秒）
Start reading|작품 열기|作品を開く
View photo|사진 보기|写真を見る
Open note|메모 열기|メモを開く
Enter conversation|대화방 열기|会話を開く
Like a post|게시물에 좋아요|投稿にいいね
Open post|게시물 열기|投稿を開く
View call details|통화 상세 보기|通話詳細を見る
Open app|앱 열기|アプリを開く
Any item|아무 항목|いずれかの項目
Extra prerequisites (optional)|추가 선행 단서 (선택)|追加の前提条件（任意）
Clue one|첫 번째 단서|手がかり1
Clue two|두 번째 단서|手がかり2
Clue relationship|단서 조건|手がかりの条件
No extra clue|추가 단서 없음|追加の手がかりなし
Both visited|둘 다 확인|両方を確認
Either visited|하나만 확인해도 됨|どちらかを確認
What happens next|다음에 일어날 일|次に起こること
Append message|대화 메시지 추가|メッセージを追加
Create note|새 메모|メモを作成
Unlock app|앱 잠금 해제|アプリを解放
Offer a choice|독자에게 선택 제시|読者に選択肢を出す
Show ending|엔딩 표시|エンディングを表示
Message app|메시지 앱|メッセージのアプリ
Message body|메시지 본문|メッセージ本文
Add action|결과 추가|結果を追加
Remove action|이 결과 삭제|この結果を削除
Move up|위로|上へ
Move down|아래로|下へ
Duplicate step|단계 복제|ステップを複製
Remove step|단계 삭제|ステップを削除
App to unlock|해제할 앱|解放するアプリ
New note title|새 메모 제목|新しいメモのタイトル
New note body|새 메모 본문|新しいメモの本文
Choice prompt|선택 안내|選択の説明
Option A|선택지 A|選択肢A
Option B|선택지 B|選択肢B
A jumps to|A 선택 시 이동|Aの移動先
B jumps to|B 선택 시 이동|Bの移動先
Next step|바로 다음 단계|次のステップ
End story|이야기 종료|物語を終了
Ending title|엔딩 제목|エンディングのタイトル
Ending body|엔딩 본문|エンディングの本文
Loading…|불러오는 중…|読み込み中…
Autosave to this browser|이 브라우저에 자동 저장|このブラウザに自動保存
Local project restored|로컬 프로젝트 복원됨|ローカルのプロジェクトを復元しました
● Unsaved changes|● 저장되지 않은 변경 사항|● 未保存の変更があります
✓ Saved in this browser|✓ 이 브라우저에 저장됨|✓ このブラウザに保存済み
Save failed · export a backup|저장 실패 · 백업을 내보내세요|保存失敗・バックアップを書き出してください
Only in this page · export a backup|현재 페이지에만 보관 · 백업을 내보내세요|このページ内のみ・バックアップを書き出してください
No account · local saving|가입 없이 · 로컬 저장|登録不要・ローカル保存
Export a project backup regularly|정기적으로 프로젝트를 백업하세요|定期的にバックアップしてください
PNG includes the work only, without the editor or frame.|PNG에는 작품 화면만 포함되며 편집기와 기기 테두리는 제외됩니다.|PNGには作品画面のみが含まれ、編集画面や端末枠は含まれません。
Tap to unlock; use editor tabs to preview apps and notes.|잠금 화면을 눌러 시작하세요. 편집 탭에서 앱과 메모를 확인할 수 있습니다.|タップしてロック解除。編集タブからアプリやメモを確認できます。
Each sheet keeps its own content and time; batch export produces separate PNGs.|각 화면의 내용과 시간을 따로 저장하고, 개별 PNG로 일괄 내보냅니다.|画面ごとに内容と時刻を保存し、個別のPNGにまとめて書き出します。
Synced with the script above; each message can have its own time.|위 스크립트와 동기화됩니다. 메시지별 시간을 설정할 수 있습니다.|上のスクリプトと連動します。メッセージごとに時刻を設定できます。
One line per message: Name: message. Add a time with Name: [23:08] message. 我 means the owner; [图片] inserts uploaded images.|한 줄에 이름：메시지 형식으로 입력하세요. 이름：[23:08] 메시지로 시간을 지정합니다. 我는 주인, [图片]는 업로드한 이미지입니다.|1行に「名前：メッセージ」。時刻は「名前：[23:08] 本文」。我 は持ち主、[图片] はアップロード画像を挿入します。
One username: comment per line, in display order.|한 줄에 사용자 이름：댓글 형식으로 입력합니다. 입력 순서대로 표시됩니다.|1行に「ユーザー名：コメント」。入力順に表示します。
TWICE · Mina × Sana · fictional demo|TWICE · 미나 × 사나 · 가상 창작 예시|TWICE · ミナ × サナ · フィクションの作例
Export screenshots|스크린샷 내보내기|画像を書き出す
If multiple downloads are blocked, save each image separately.|연속 다운로드가 차단되면 이미지를 하나씩 저장하세요.|連続ダウンロードがブロックされた場合は1枚ずつ保存してください。
The owner and contact occupy two slots. Add up to seven others; script sender names must match.|주인과 상대방을 포함해 최대 9명입니다. 나머지 7명을 추가할 수 있으며 스크립트 이름과 일치해야 합니다.|持ち主と相手を含め最大9人です。他に7人まで追加でき、スクリプトの送信者名と一致させてください。
Chat and social content is shared with screenshot mode.|대화와 SNS 콘텐츠는 스크린샷 모드와 공유됩니다.|会話とSNSの内容はスクリーンショットモードと共有します。
Multiple notes open as a list; a single note opens directly.|메모가 여러 개면 목록을, 하나면 내용을 바로 엽니다.|メモが複数なら一覧、1件なら本文を直接開きます。
Disabled apps are absent from the reader and cannot be opened through notifications. Screenshot templates remain available.|사용하지 않는 앱은 작품에 표시되지 않으며 알림으로도 열 수 없습니다. 스크린샷 템플릿은 계속 사용할 수 있습니다.|無効なアプリは作品に表示されず、通知からも開けません。画像テンプレートは引き続き使えます。
Up to 13 steps and 3 actions per step. Each step waits for a new reader event.|최대 13단계, 단계별 결과는 3개입니다. 다음 단계는 새로운 독자 행동을 기다립니다.|最大13ステップ、各ステップに結果3件まで。次のステップは新しい読者の行動を待ちます。
After the previous step, wait for:|이전 단계가 끝나면 기다릴 행동:|前のステップ終了後、待つ行動：
After the story starts, wait for:|이야기가 시작되면 기다릴 행동:|物語開始後、待つ行動：
Enable this app under Apps and mark it initially locked.|앱 설정에서 사용을 켜고 시작 시 잠금을 선택하세요.|アプリ設定で有効にして「開始時はロック」を選んでください。
Open Story test log to debug. Editing resets the preview; exported readers save progress locally. Branches can only jump forward.|스토리 테스트 기록을 펼쳐 확인하세요. 편집하면 미리보기가 초기화됩니다. 내보낸 작품은 로컬에 진행을 저장합니다. 분기는 앞으로만 이동합니다.|テスト記録で確認できます。編集するとプレビューはリセットされます。書き出した作品は端末に進行を保存します。分岐は後方へ戻れません。
Automatic mode marks only your messages after the last incoming reply. Enter 1, 2… to override the boundary; numbers count all messages.|자동 모드는 상대방의 마지막 답장 이후 내 메시지만 표시합니다. 1, 2…를 입력하면 시작점을 지정합니다. 번호는 전체 메시지 기준입니다.|自動では相手の最後の返信以降の自分のメッセージのみ未読にします。1、2…で開始位置を指定できます。番号は全メッセージ共通です。
FicPhone user guide|FicPhone 사용 안내|FicPhone 使い方
Start creating|창작 시작|作成を始める
Saving|저장|保存
Interaction & hints|인터랙션과 힌트|操作とヒント
Publishing|게시|公開
Saving & recovery|저장과 복원|保存と復元
Share a playable link|링크로 작품 공유|遊べるリンクを共有
GitHub Pages steps|GitHub Pages 게시 방법|GitHub Pagesの手順
Local projects|로컬 프로젝트|ローカルのプロジェクト
Save a copy to library|현재 프로젝트 사본 저장|現在のプロジェクトのコピーを保存
Load this copy|이 사본 불러오기|このコピーを読み込む
Character library|캐릭터 자료실|キャラクターライブラリ
Use as owner|주인으로 설정|持ち主に設定
Use as contact|상대방으로 설정|相手に設定
Delete|삭제|削除
Name|이름|名前
Instagram username|Instagram 사용자 이름|Instagramユーザー名
Avatar|프로필 사진|アイコン
Save character|캐릭터 저장|キャラクターを保存
Pre-export check|내보내기 전 점검|書き出し前チェック
Open story settings|스토리 설정 열기|物語設定を開く
Save a copy first|먼저 사본을 저장하세요|先にコピーを保存
Choose a platform, then edit messages or posts. Duplicate up to nine independent sheets with different times, and export a ZIP. Up to nine images per item; swipe social images horizontally.|플랫폼을 골라 대화나 게시물을 편집하세요. 시간과 내용이 다른 화면을 최대 9개 만들고 ZIP으로 내보낼 수 있습니다. 첨부 이미지는 최대 9장, SNS 이미지는 가로로 넘겨 봅니다.|プラットフォームを選び、会話や投稿を編集します。時刻の異なる画面を最大9枚作成しZIP出力できます。添付画像は最大9枚、SNS画像は横にスワイプできます。
Drafts stay in this browser. Export JSON backups regularly; JSON is editable, while PNG and HTML are finished works. Export JSON before switching devices or site addresses. Undo/redo restores recent edits.|초안은 이 브라우저에 저장됩니다. JSON을 정기적으로 백업하세요. JSON은 재편집용, PNG와 HTML은 완성본입니다. 기기나 주소를 바꾸기 전에 JSON을 내보내세요. 실행 취소로 최근 편집을 복원할 수 있습니다.|下書きはこのブラウザに保存されます。JSONは再編集用、PNGとHTMLは完成品です。端末やURLを変える前にJSONを保存してください。最近の編集は元に戻せます。
Configure apps, content and up to thirteen story steps in Interactive phone. Disabled apps are absent. Authors can allow hints and write two hint levels per step. Opening this guide preserves your preview.|인터랙티브 휴대폰에서 앱, 콘텐츠, 최대 13단계를 설정합니다. 사용하지 않는 앱은 숨겨집니다. 단계마다 두 수준의 힌트를 작성할 수 있습니다. 안내를 열어도 테스트 진행은 유지됩니다.|アプリ、内容、最大13ステップを設定します。無効なアプリは非表示です。ステップごとに2段階のヒントを書けます。このガイドを開いてもテストの進行は維持されます。
Export interactive HTML, rename it index.html and place it in a folder. Upload to a static web host to get a playable URL. A file-download link is not web hosting. Keep your project JSON private.|인터랙티브 HTML을 내보내 index.html로 바꾸고 폴더에 넣으세요. 정적 웹 호스팅에 올리면 링크를 얻습니다. 파일 다운로드 링크와는 다릅니다. 프로젝트 JSON은 따로 보관하세요.|HTMLを書き出し、index.htmlに改名してフォルダへ入れます。静的ホスティングにアップロードするとURLが発行されます。ファイル配布リンクとは異なります。JSONは手元に保管してください。
Create a public repository, upload index.html and commit.|공개 저장소를 만들고 index.html을 올린 후 커밋합니다.|公開リポジトリを作り、index.htmlをアップロードしてコミットします。
Select main and /(root), save and wait for deployment.|main과 /(root)를 선택해 저장하고 게시를 기다립니다.|mainと/(root)を選び、保存して公開を待ちます。
Test the Pages URL on a phone and in a signed-out browser before sharing.|휴대폰과 로그아웃한 브라우저로 주소를 테스트한 후 공유하세요.|スマホとログアウト状態のブラウザでURLを確認してから共有してください。
To update, replace index.html in the same repository; keep the repository.|같은 저장소의 index.html을 교체하세요. 저장소는 삭제하지 마세요.|更新は同じリポジトリのindex.htmlを置き換えます。リポジトリは削除しないでください。
Hosts have file and quota limits; test on your readers’ networks. FicPhone does not upload works automatically. Cloudflare Pages currently limits individual files to 25 MiB.|호스팅에는 용량과 사용량 제한이 있습니다. 독자의 네트워크에서 테스트하세요. FicPhone은 자동 업로드하지 않습니다. Cloudflare Pages의 현재 단일 파일 제한은 25 MiB입니다.|ホストには容量・利用枠の制限があります。読者の回線で確認してください。自動アップロードはありません。Cloudflare Pagesの現時点の1ファイル上限は25 MiBです。
Cloudflare direct upload guide|Cloudflare 직접 업로드 안내|Cloudflare直接アップロード案内
GitHub Pages guide|GitHub Pages 안내|GitHub Pages案内
Projects remain in this browser. Clearing site data removes them; keep JSON backups.|프로젝트는 이 브라우저에 저장됩니다. 사이트 데이터를 지우면 사라지므로 JSON을 백업하세요.|プロジェクトはこのブラウザ内に保存されます。サイトデータを消すと失われるためJSONを保存してください。
Characters are included in JSON backups. Applying a character updates names, avatars and username; it does not rewrite story text.|캐릭터는 JSON 백업에 포함됩니다. 적용하면 이름, 프로필 사진, 계정만 바뀌며 이야기 본문은 바뀌지 않습니다.|キャラクターはJSONに含まれます。適用すると名前・アイコン・アカウントのみ変わり、本文は書き換えません。
No issues found by the current checks. Test every branch and ending; this check does not prove all paths are reachable.|현재 점검 범위에서 문제를 찾지 못했습니다. 모든 분기와 엔딩을 직접 테스트하세요. 모든 경로의 도달 가능성을 보장하지는 않습니다.|現在のチェックでは問題が見つかりませんでした。各分岐と結末を試してください。すべての経路に到達できる保証ではありません。
`;
for(const row of rows.trim().split('\n')){const [en,ko,ja]=row.split('|');if(en&&ko&&ja){window.FicPhoneLocales.ko[en]=ko;window.FicPhoneLocales.ja[en]=ja;}}
})();
