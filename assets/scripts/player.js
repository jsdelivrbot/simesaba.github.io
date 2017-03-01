$(() => {
  let queries = location.search.substr(1)
    .split('&')
    .reduce((obj, v) => {
      let pair = v.split('=');
      return Object.assign(obj, { [pair[0]]: pair[1] });
    }, {});
  let id = queries.id;
  let body = $('#body');
  if (!id) {
    let name = queries.name;
    if (!name) {
      $('<h2>').text('プレイヤー情報').appendTo(body);
      $('<p>').text('プレイヤー情報を取得できませんでした。').appendTo(body);
    }
    fetch(`http://new.simesaba.online:3000/uuid?name=${name}`)
      .then(x => x.json())
      .then(({ id }) => {
        location.href = `http://new.simesaba.online/gamedata/player?id=${normalizeUUID(id)}`;
      }).catch(x => {
        $('<h2>').text('プレイヤー情報').appendTo(body);
        $('<p>').text('プレイヤー情報を取得できませんでした。').appendTo(body);
      });
    return;
  }
  fetch(`http://new.simesaba.online:3000/player?id=${id}`)
    .then(x => x.json())
    .then(player => {
      if (player.code !== 200) {
        $('<h2>').text('プレイヤー情報').appendTo(body);
        $('<p>').text('プレイヤー情報を取得できませんでした。').appendTo(body);
        return;
      }
      let trimmedId = id.split('-').join('');

      document.title = `${player.name}の${document.title}`;
      $('<h2>').text(`${player.name}のプレイヤー情報`).appendTo(body);
      $('<h3>').text('スキン').appendTo(body);
      $('<p>').append($('<img>').attr('src', `https://crafatar.com/renders/body/${id}?overlay=1`)).appendTo(body);

      $('<h3>').text('基本情報').appendTo(body);
      $('<h4>').text(`Japan Minecraft Servers`).appendTo(body);
      $('<p>').append($('<a>').attr('href', `https://minecraft.jp/players/${trimmedId}`).text(`https://minecraft.jp/players/${trimmedId}`)).appendTo(body);
      $('<h4>').text('オペレーターかどうか').appendTo(body);
      $('<p>').text(player.isOp ? 'はい' : 'いいえ').appendTo(body);
      if (player.isOp) {
        return;
      }
      $('<h4>').text('初回ログイン').appendTo(body);
      $('<p>').text(formatDate(new Date(player.firstPlayed))).appendTo(body);
      $('<h4>').text('最終ログイン').appendTo(body);
      $('<p>').text(formatDate(new Date(player.lastPlayed))).appendTo(body);
      $('<h4>').text('プレイ時間').appendTo(body);
      $('<p>').text(`${player.hoursPlayed} 時間`).appendTo(body);
      $('<h4>').text('所持金').appendTo(body);
      $('<p>').text(`${player.money} 円`).appendTo(body);

      $('<h3>').text('PvP情報').appendTo(body);
      $('<h4>').text('レート').appendTo(body);
      $('<p>').text(player.pvpstats.elo).appendTo(body);
      $('<h4>').text('キル数').appendTo(body);
      $('<p>').text(`${player.pvpstats.kills} 回`).appendTo(body);
      $('<h4>').text('死亡数').appendTo(body);
      $('<p>').text(`${player.pvpstats.deaths} 回`).appendTo(body);

      $('<h3>').text('処罰履歴').appendTo(body);

      if (player.punishments.length === 0) {
        $('<p>').text('なし').appendTo(body);
      } else {
        let table = $('<table>');
        let thead = $('<thead><tr><th>Minecraftアカウント</th><th>種類</th><th>理由</th><th>処罰執行者</th><th>時刻</th><th>期限</th></tr></thead>');
        let tbody = $('<tbody>');
        player.punishments.forEach((punishment, i) => {
          let account = `<td>${punishment.name}</td>`;
          let type = `<td>${punishmentTypeToText(punishment.punishmentType)}</td>`;
          let start = `<td>${formatDate(new Date(parseInt(punishment.start)))}</td>`;
          let end = `<td>${punishment.end === '-1' ? '無期限' : formatDate(new Date(parseInt(punishment.end)))}</td>`;
          let tr = $(`<tr>${account}${type}<td>${punishment.reason}</td><td>${punishment.operator}</td>${start}${end}</tr>`);
          tbody.append(tr);
          table.append(thead);
          table.append(tbody);
          body.append(table);
        });
      }

      function punishmentTypeToText(type) {
        switch (type) {
          case 'BAN': return 'BAN';
          case 'IP_BAN': return 'IPBAN';
          case 'TEMP_BAN': return '一時BAN';
          case 'KICK': return 'キック';
          case 'WARNING': return '警告';
          case 'MUTE': return 'ミュート';
          case 'TEMP_MUTE': return '一時ミュート';
          default: return type;
        }
      }

      function formatDate(date) {
        return 'YYYY/MM/DD hh:mm:ss'
          .replace(/YYYY/g, date.getFullYear())
          .replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
          .replace(/DD/g, ('0' + date.getDate()).slice(-2))
          .replace(/hh/g, ('0' + date.getHours()).slice(-2))
          .replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
          .replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
      }
    });

  function normalizeUUID(uuid) {
    let a = uuid.slice(0, 8);
    let b = uuid.slice(8, 12);
    let c = uuid.slice(12, 16);
    let d = uuid.slice(16, 20);
    let e = uuid.slice(20, 32);
    return `${a}-${b}-${c}-${d}-${e}`;
  }
});
