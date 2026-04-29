import TableGrid from "../components/TableGrid";

function ServiceTable({ tables = [], onTableClick }) {
  return (
    <main className="p1-page">
      <section className="p1-section">
        <h1 className="p1-page-title">เลือกโต๊ะที่ต้องการบริการ</h1>

        <TableGrid tables={tables} onTableClick={onTableClick} />
      </section>
    </main>
  );
}

export default ServiceTable;