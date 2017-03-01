fetch('http://new.simesaba.online:3000/punishments')
  .then(x => x.json())
  .then(punishments => {
    $(() => {
      let body = $('#body');
      let table = $('<table>');
      let thead = $('<thead><tr><th>Minecraftアカウント</th><th>種類</th><th>理由</th><th>処罰執行者</th><th>時刻</th><th>期限</th></tr></thead>');
      let tbody = $('<tbody>');
      punishments.forEach((punishment, i) => {
        let account = `<td><a href="http://new.simesaba.online/gamedata/player?id=${normalizeUUID(punishment.uuid)}">${punishment.name}</a></td>`;
        let type = `<td>${punishmentTypeToText(punishment.punishmentType)}</td>`;
        let start = `<td>${formatDate(new Date(parseInt(punishment.start)))}</td>`;
        let end = `<td>${punishment.end === '-1' ? '無期限' : formatDate(new Date(parseInt(punishment.end)))}</td>`;
        let tr = $(`<tr>${account}${type}<td>${punishment.reason}</td><td>${punishment.operator}</td>${start}${end}</tr>`);
        tbody.append(tr);

        function normalizeUUID(uuid) {
          let a = uuid.slice(0, 8);
          let b = uuid.slice(8, 12);
          let c = uuid.slice(12, 16);
          let d = uuid.slice(16, 20);
          let e = uuid.slice(20, 32);
          return `${a}-${b}-${c}-${d}-${e}`;
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
      })
      table.append(thead);
      table.append(tbody);
      body.append(table);
    });
  });
