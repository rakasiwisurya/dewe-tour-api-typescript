export const buildUpdateQueryPS = (
  tableName: string,
  data: any,
  condition: any,
  returnField: string = "id_seq"
) => {
  if (tableName !== "" && typeof data === "object" && typeof condition === "object") {
    let query = `UPDATE ${tableName} SET `;
    let x = 0;
    let s = 1;
    let buildData: Array<any> = [];

    Object.keys(data).forEach((key) => {
      if (x == 0) {
        query += `"${key}"=$${s}`;
        buildData.push(data[key]);
      } else {
        query += `, "${key}"=$${s}`;
        buildData.push(data[key]);
      }
      x++;
      s++;
    });

    query += " WHERE ";

    let z = 0;
    Object.keys(condition).forEach((key) => {
      if (z == 0) {
        query += `${key}=$${s}`;
        buildData.push(condition[key]);
      } else {
        query += `, ${key}=$${s}`;
        buildData.push(condition[key]);
      }
      z++;
      s++;
    });

    query += ` RETURNING ${returnField} `;

    return { query, data: buildData };
  } else {
    return { query: null, data: [] };
  }
};
