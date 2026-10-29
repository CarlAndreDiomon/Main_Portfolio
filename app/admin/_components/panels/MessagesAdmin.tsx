"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import styles from "./Panel.module.css";

export default function MessagesAdmin() {
  const messages = useQuery(api.contact.list);
  const markRead = useMutation(api.contact.markRead);
  const remove = useMutation(api.contact.remove);

  const sorted = [...(messages ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadCount = sorted.filter((m) => !m.read).length;

  return (
    <div>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>
          {sorted.length} Messages {unreadCount > 0 && `(${unreadCount} unread)`}
        </span>
      </div>

      <div className={styles.list}>
        {sorted.length === 0 && (
          <p className={styles.empty}>No contact messages received yet.</p>
        )}
        {sorted.map((m) => (
          <div
            key={m._id}
            className={`${styles.msgCard} ${!m.read ? styles.unread : ""}`}
          >
            <div className={styles.msgHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {!m.read && <span className={styles.unreadDot} />}
                <span className={styles.msgName}>{m.name}</span>
                <span className={styles.msgMeta}>({m.email})</span>
              </div>
              <span className={styles.msgMeta}>
                {new Date(m.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {m.subject && <div className={styles.msgSubject}>{m.subject}</div>}

            <div className={styles.msgBody}>{m.message}</div>

            <div className={styles.msgActions}>
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "Portfolio inquiry")}`}
                className="btn btn-ghost"
                style={{ fontSize: "0.8125rem", padding: "0.25rem 0.625rem" }}
              >
                Reply via Email
              </a>
              {!m.read && (
                <button
                  className={styles.btnEdit}
                  onClick={() => markRead({ id: m._id as Id<"contactMessages"> })}
                >
                  Mark as Read
                </button>
              )}
              <button
                className={styles.btnDelete}
                onClick={() => remove({ id: m._id as Id<"contactMessages"> })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
