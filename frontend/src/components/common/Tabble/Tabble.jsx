import {memo} from "react";
import ReactTableUI from "react-table-ui";

function Tabble({data, columns, title}) {
    return<div className="content-admin-table"><ReactTableUI title={title} data={data} columns={columns}/>;</div>
}

export default memo(Tabble);
