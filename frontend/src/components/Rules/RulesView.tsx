import React, { useState } from 'react';
import { Zap, Plus, Trash2, CheckCircle, Play } from 'lucide-react';
import { Rule } from '../../types';

interface RulesViewProps {
  rules: Rule[];
  onCreateRule: (rule: any) => void;
  onDeleteRule: (id: number) => void;
  onExecuteRules: () => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  rules,
  onCreateRule,
  onDeleteRule,
  onExecuteRules
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [field, setField] = useState('category');
  const [operator, setOperator] = useState('equals');
  const [value, setValue] = useState('');
  const [action, setAction] = useState('archive');
  const [actionVal, setActionVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;
    onCreateRule({
      name,
      condition_field: field,
      condition_operator: operator,
      condition_value: value,
      action_type: action,
      action_value: actionVal || undefined
    });
    setShowModal(false);
    setName('');
    setValue('');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" /> Custom Automation Rules Engine
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Build rules to automatically archive newsletters, star bank alerts, and clean expired OTPs.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExecuteRules}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" /> Run All Rules Now
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Rule
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{rule.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Triggered {rule.trigger_count} times
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                IF <span className="text-zinc-200 font-medium">{rule.condition_field}</span> {rule.condition_operator} &quot;<span className="text-indigo-300 font-medium">{rule.condition_value}</span>&quot; → THEN <span className="text-emerald-400 font-medium uppercase">{rule.action_type}</span> {rule.action_value ? `(${rule.action_value})` : ''}
              </p>
            </div>
            <button
              onClick={() => onDeleteRule(rule.id)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-950/60 hover:text-red-300 text-zinc-400 transition-colors"
              title="Delete Rule"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 glass-panel">
            <h3 className="text-base font-bold text-white">Create Automation Rule</h3>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Rule Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Star Chase Bank Emails"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Field</label>
                <select value={field} onChange={(e) => setField(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white">
                  <option value="category">Category</option>
                  <option value="sender">Sender Email</option>
                  <option value="subject">Subject</option>
                  <option value="age_days">Email Age (Days)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Operator</label>
                <select value={operator} onChange={(e) => setOperator(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white">
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="older_than">Older Than</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold">Value</label>
              <input
                required
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. Banking or github.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold">Action</label>
                <select value={action} onChange={(e) => setAction(e.target.value)} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white">
                  <option value="archive">Archive</option>
                  <option value="star">Star</option>
                  <option value="delete">Delete</option>
                  <option value="label">Apply Label</option>
                </select>
              </div>

              {action === 'label' && (
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold">Label Name</label>
                  <input
                    type="text"
                    value={actionVal}
                    onChange={(e) => setActionVal(e.target.value)}
                    placeholder="e.g. GitHub"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
              >
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
