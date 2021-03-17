# Alnya.github.io
Alnya's portfolio


## *GitHub Desktop*を活用した共同開発手順

<br>

### リモートmainブランチ→ローカル作業ブランチの同期手順（重要）

> 1. **Current branch**をクリックして***ローカルmain***ブランチへ切り替える
>1. **Fetch origin**、**Pull origin**をクリックして**リモートmain**ブランチの変更を***ローカルmain***ブランチへ取り入れる
>1. **Current branch**をクリックし、自分の作業ブランチ(your branch)へ切り替える
>1. **Current branch**をクリックし、画面下の方に出てくる**Choose a branch to merge into your branch**をクリック
>1. **main**ブランチを選んで、**Merge main into your branch**をクリック

これで**リモートmain**ブランチから自分のローカル作業ブランチへ完全に同期できる
コンフリクトが発生したら要審議って感じで

<br>

### ローカル作業ブランチ→リモートmainブランチへPull Requestを送る手順

> 1. 最新の**リモートmain**ブランチと作業ブランチが同期されているか確認（上記の手順を踏めば問題ないはず）
>1. **Current branch**が自分の作業ブランチになっているか確認
>1. 画面左側で変更されたファイルが表示されているはずなので、変更内容を確認
>1. 問題なければ左下にコミットメッセージを書いて、**Commit to your branch**をクリック（ここでyour branchが自分の作業ブランチになっているか確認）
>1. **Push origin**をクリックし、リモート作業ブランチへPush
>1. 恐らく**Create Pull Request**的なボタンが現れるので、クリック
>1. *Git Hub*へ遷移して**Pull Request**を作成

これで、自分のローカル作業ブランチから**リモートmain**ブランチへ**Pull Request**を送ることができる
