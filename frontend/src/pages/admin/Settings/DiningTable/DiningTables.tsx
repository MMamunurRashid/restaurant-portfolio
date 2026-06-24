import { useEffect, useState, type FormEvent } from "react";
import { Armchair, Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import type { TResponse } from "@/interface/globalInterface";
import type { IDiningTable } from "@/interface/diningTableInterface";
import {
  useAddDiningTableMutation,
  useDeleteDiningTableMutation,
  useGetAllDiningTableQuery,
  useUpdateDiningTableMutation,
} from "@/redux/features/diningTable/diningTableApi";

type DiningTableForm = {
  tableNumber: string;
  capacity: number;
  area: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm: DiningTableForm = {
  tableNumber: "",
  capacity: 2,
  area: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

const getErrorMessage = (res: TResponse) =>
  Array.isArray(res?.error?.data?.error) && res.error.data.error.length > 0
    ? `${res.error.data.error[0]?.path || ""} ${
        res.error.data.error[0]?.message || ""
      }`.trim()
    : res?.error?.data?.message || "Something went wrong!";

export default function DiningTables() {
  const [form, setForm] = useState<DiningTableForm>(emptyForm);
  const [editingTable, setEditingTable] = useState<IDiningTable | null>(null);

  const { data, isLoading } = useGetAllDiningTableQuery({
    limit: 100,
    sort: "sortOrder,tableNumber",
  });
  const tables = (data?.data || []) as IDiningTable[];
  const [addDiningTable, { isLoading: isAdding }] = useAddDiningTableMutation();
  const [updateDiningTable, { isLoading: isUpdating }] =
    useUpdateDiningTableMutation();
  const [deleteDiningTable] = useDeleteDiningTableMutation();

  useEffect(() => {
    if (!editingTable) {
      setForm(emptyForm);
      return;
    }

    setForm({
      tableNumber: editingTable.tableNumber || "",
      capacity: editingTable.capacity || 2,
      area: editingTable.area || "",
      description: editingTable.description || "",
      sortOrder: editingTable.sortOrder || 0,
      isActive: editingTable.isActive !== false,
    });
  }, [editingTable]);

  const updateField = <K extends keyof DiningTableForm>(
    key: K,
    value: DiningTableForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      tableNumber: form.tableNumber.trim(),
      capacity: Number(form.capacity),
      area: form.area.trim(),
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };

    const res = editingTable
      ? ((await updateDiningTable({
          id: editingTable._id,
          data: payload,
        })) as TResponse)
      : ((await addDiningTable(payload)) as TResponse);

    if (res?.data?.success) {
      toast.success(
        editingTable ? "Dining table updated" : "Dining table added",
      );
      setEditingTable(null);
      setForm(emptyForm);
      return;
    }

    toast.error(getErrorMessage(res));
  };

  const handleDelete = async (table: IDiningTable) => {
    if (!window.confirm(`Delete table ${table.tableNumber}?`)) return;

    const res = (await deleteDiningTable(table._id)) as TResponse;
    if (res?.data?.success) {
      toast.success("Dining table deleted");
      return;
    }

    toast.error(getErrorMessage(res));
  };

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500 lg:grid-cols-12">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-4">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Armchair size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral">
                {editingTable ? "Edit Table" : "Add Table"}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage table capacity and service areas.
              </p>
            </div>
          </div>
          {editingTable && (
            <button
              type="button"
              onClick={() => setEditingTable(null)}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-destructive"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label>Table Number</label>
            <input
              type="text"
              value={form.tableNumber}
              onChange={(event) => updateField("tableNumber", event.target.value)}
              placeholder="T-01"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label>Capacity</label>
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(event) =>
                  updateField("capacity", Number(event.target.value))
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <label>Sort Order</label>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  updateField("sortOrder", Number(event.target.value))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label>Area</label>
            <input
              type="text"
              value={form.area}
              onChange={(event) => updateField("area", event.target.value)}
              placeholder="Main hall, Patio, VIP room"
            />
          </div>

          <div className="space-y-1.5">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Window side, near bar, private corner..."
            />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <span>
              <span className="block text-sm font-bold text-neutral">Active</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Active tables can be assigned to reservations.
              </span>
            </span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
          </label>

          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className="admin_primary_btn w-full justify-center"
          >
            {isAdding || isUpdating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : editingTable ? (
              <Save size={18} />
            ) : (
              <Plus size={18} />
            )}
            {editingTable ? "Save Table" : "Add Table"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral">Dining Tables</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {tables.length} table{tables.length === 1 ? "" : "s"} configured.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="p-4 text-xs font-bold uppercase text-slate-500">Table</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500">Area</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500">Capacity</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm text-slate-400">
                    Loading tables...
                  </td>
                </tr>
              ) : tables.length > 0 ? (
                tables.map((table) => (
                  <tr key={table._id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{table.tableNumber}</p>
                      {table.description && (
                        <p className="mt-1 max-w-xs text-xs text-slate-400 line-clamp-1">
                          {table.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-500">
                      {table.area || "General"}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                      {table.capacity} guests
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          table.isActive
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {table.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTable(table)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-primary hover:text-primary"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(table)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm italic text-slate-400">
                    No dining tables configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
