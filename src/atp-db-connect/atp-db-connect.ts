import oracledb from "oracledb";
import { env } from "process";
import dotenv from "dotenv";
dotenv.config();

/**
 * This method is use to execute sql query
 * @param query SQL query string to execute
 */
export const sqlExecute = async (query: string): Promise<oracledb.Result<unknown> | undefined> => {
  oracledb.initOracleClient({ libDir: "../../instantclient_21_6" });
  let connection, connectString;
  const db_user = env.DB_USER;
  const db_password = env.DB_PASSWORD;
  console.log("ATP DB Username:", db_user);
  console.log("ATP DB Password:", db_password);

  // Set connection string
  switch (String(env.NODE_ENV).toUpperCase()) {
    case "DEV":
      connectString = `dev_low`;
      break;
    case "QA":
      connectString = `qa_low`;
      break;
    case "QAPINTLAB":
      connectString = `qapintlab1_low`;
      break;
    case "QACHAOS":
      connectString = `qachaos_low`;
      break;
    default:
      connectString = `qa_low`;
  }
  console.log(`Connection string is set using: ${connectString}`);

  try {
    let binds, options;
    // Get Connection
    connection = await oracledb.getConnection({
      user: db_user,
      password: db_password,
      connectString: connectString,
    });
    console.log("Successfully connected to Oracle ATP Database");

    console.log(`Executing SQL Query: ${query}`);
    // Set Binds
    binds = {};

    // Set options
    options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
      resultSet: false,
      // extendedMetaData: true,               // get extra metadata
      // prefetchRows:     100,                // internal buffer allocation size for tuning
      // fetchArraySize:   100                 // internal buffer allocation size for tuning
    };

    // Execute Query
    const result = await connection.execute(query, binds, options);
    console.log(`QUERY [${query}] RESULT: \n`, JSON.stringify(result, null, 2));

    return result;
  } catch (err) {
    console.log(`${(err as Error).message}`);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.log(`${(err as Error).message}`);
      }
    }
  }
};

/**
 * This method gets all columns from a specified Database SQL Query
 * @param response SQL query string to execute
 */
export const sqlGetAllColumns = async (response: any) => {
  try {
    return response.metaData;
  } catch (error: any) {
    console.log("FAILED", error);
  }
};
