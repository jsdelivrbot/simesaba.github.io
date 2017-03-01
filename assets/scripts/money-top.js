fetch('http://new.simesaba.online:3000/money-top')
  .then(x => x.json())
  .then(accounts => {
    $(() => {
      let body = $('#body');
      let table = $('<table>');
      let thead = $('<thead><tr><th>順位</th><th>プレイヤー名</th><th>所持金</th></tr></thead>');
      let tbody = $('<tbody>');
      accounts.forEach((account, i) => {
        let name = `<td><a href="http://new.simesaba.online/gamedata/player?name=${account.username}">${account.username}</a></td>`;
        let tr = $(`<tr><td>${i + 1}</td>${name}<td>${account.balance}</td></tr>`);
        tbody.append(tr);
      })
      table.append(thead);
      table.append(tbody);
      body.append(table);
    });
  });
