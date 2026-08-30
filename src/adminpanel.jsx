import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ImagePlus,
  LayoutDashboard,
  Mail,
  LogOut,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import {
  deleteContent,
  getImageUrl,
  getServices,
  getVentures,
  getContactSettings,
  getAdminAccess,
  getSession,
  hasAdminAccess,
  saveContent,
  saveContactSettings,
  signIn,
  signOut,
  requestPasswordReset,
  createAdminAuthUser,
  saveAdminAccess,
  setAdminAccess as setAdminAccessStatus,
  updateAdminCredentials,
  uploadImage,
} from "@/api";
import styles from "./adminpanel.module.css";

const emptyItem = {
  name: "",
  description: "",
  image_url: "",
  detail_image_url: "",
  landing_image_url: "",
  website_url: "",
  is_live: true,
  display_order: 0,
};

const DESCRIPTION_WORD_LIMIT = 100;

function limitWords(value) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length > DESCRIPTION_WORD_LIMIT
    ? words.slice(0, DESCRIPTION_WORD_LIMIT).join(" ")
    : value;
}

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function adminAccessErrorMessage(error) {
  if (error?.code === "42P01" || error?.code === "42883" || error?.message?.includes("admin_access") || error?.message?.includes("is_active_admin")) {
    return "Admin access is not configured in Supabase yet. Run supabase/schema.sql in the Supabase SQL Editor, then refresh this page.";
  }
  return error?.message || "Could not update admin access.";
}

function authErrorMessage(error) {
  if (error?.code === "invalid_credentials" || error?.message?.toLowerCase().includes("invalid login credentials")) {
    return "Email or password is incorrect. Create or reset this user's password in Supabase Authentication, then sign in with that exact email and password.";
  }
  return adminAccessErrorMessage(error);
}

export default function AdminPanel() {
  const [type, setType] = useState("ventures");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [contactSettings, setContactSettings] = useState(null);
  const [accountSettings, setAccountSettings] = useState({ email: "", password: "", confirmPassword: "" });
  const [adminAccess, setAdminAccess] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  useEffect(() => {
    async function restoreSession() {
      const result = await getSession();
      const sessionUser = result?.data.session?.user;
      if (!sessionUser) return;
      try {
        if (await hasAdminAccess()) setUser(sessionUser);
        else {
          await signOut();
          setMessage("This account no longer has admin access.");
        }
      } catch (error) {
        setMessage(adminAccessErrorMessage(error));
      }
    }
    restoreSession();
  }, []);
  useEffect(() => {
    if (!user) return;
    if (type === "contact") getContactSettings().then(setContactSettings);
    else if (type === "access") loadAdminAccess();
    else if (type !== "account") loadItems();
  }, [type, user]);
  useEffect(() => {
    if (user?.email) setAccountSettings({ email: user.email, password: "", confirmPassword: "" });
  }, [user]);
  async function loadItems() {
    setItems(type === "ventures" ? await getVentures() : await getServices());
  }

  function editItem(item) {
    setForm({ ...emptyItem, ...item, is_live: item.is_active !== false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyItem);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await saveContent(type, { ...form, description: limitWords(form.description) });
      resetForm();
      await loadItems();
      setMessage("Changes saved and published.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await saveContactSettings(contactSettings);
      setMessage("Contact details saved and published.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function loadAdminAccess() {
    try {
      setAdminAccess(await getAdminAccess());
    } catch (error) {
      setMessage(adminAccessErrorMessage(error));
    }
  }

  async function handleAccountSubmit(event) {
    event.preventDefault();
    if (accountSettings.password !== accountSettings.confirmPassword) {
      setMessage("The new password and confirmation do not match.");
      return;
    }
    if (accountSettings.password && accountSettings.password.length < 8) {
      setMessage("Use a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const updatedUser = await updateAdminCredentials(accountSettings);
      setUser(updatedUser);
      setAccountSettings((current) => ({ ...current, password: "", confirmPassword: "" }));
      setMessage("Account credentials updated. Confirm the email change if Supabase sends a verification email.");
    } catch (error) {
      setMessage(adminAccessErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminAccessSubmit(event) {
    event.preventDefault();
    if (newAdminPassword && newAdminPassword.length < 8) {
      setMessage("Use a temporary password of at least 8 characters.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await saveAdminAccess(newAdminEmail);
      if (newAdminPassword) await createAdminAuthUser(newAdminEmail, newAdminPassword);
      setNewAdminEmail("");
      setNewAdminPassword("");
      await loadAdminAccess();
      setMessage(newAdminPassword ? "Admin account created and access granted. Share the temporary password securely." : "Admin access granted.");
    } catch (error) {
      setMessage(adminAccessErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleAdminAccessChange(email, isActive) {
    if (!isActive && user?.email?.toLowerCase() === email.toLowerCase()) {
      setMessage("You cannot revoke your own access while signed in. Use another active admin account to revoke this email.");
      return;
    }
    const action = isActive ? "restore" : "revoke";
    if (!window.confirm(`${action[0].toUpperCase()}${action.slice(1)} admin access for ${email}?`)) return;
    setBusy(true);
    setMessage("");
    try {
      await setAdminAccessStatus(email, isActive);
      setAdminAccess((current) => current.map((admin) => (
        admin.email === email
          ? { ...admin, is_active: isActive, revoked_at: isActive ? null : new Date().toISOString() }
          : admin
      )));
      setMessage(`Admin access ${isActive ? "restored" : "revoked"}.`);
      await loadAdminAccess();
    } catch (error) {
      setMessage(adminAccessErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await deleteContent(type, id);
      await loadItems();
      setMessage("Item deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleImage(event, field) {
    const file = event.target.files[0];
    if (!file) return;
    setBusy(true);
    setMessage("Uploading image...");
    try {
      const imageUrl = await uploadImage(file, type);
      setForm((current) => ({ ...current, [field]: imageUrl }));
      setMessage("Image uploaded. Save to publish it.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  const descriptionWords = countWords(form.description);

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await signIn(credentials.email, credentials.password);
      if (result.error) throw result.error;
      if (!(await hasAdminAccess())) {
        await signOut();
        throw new Error("This account does not have admin access.");
      }
      setUser(result.data.user);
    } catch (error) {
      setMessage(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset() {
    if (!credentials.email) {
      setMessage('Enter your email address first, then select Reset password.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await requestPasswordReset(credentials.email);
      setMessage('If this email has an account, a password-reset link has been sent. Open it in this browser.');
    } catch (error) {
      setMessage(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (!user)
    return (
      <main className={styles.authPage}>
        <div className={styles.authPanel}>
          <p className={styles.kicker}>HOUSE OF VENTURES</p>
          <h1>Welcome back.</h1>
          <p className={styles.authIntro}>Sign in with your registered Supabase admin account.</p>
          <form onSubmit={handleAuth} className={styles.authForm}>
            <label>
              Email address
              <input
                required
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({ ...credentials, email: event.target.value })
                }
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
              />
            </label>
            <button className={styles.primaryButton} disabled={busy}>
              {busy ? "Please wait..." : "Sign in"}{" "}
              <ArrowUpRight size={17} />
            </button>
            <button type="button" className={styles.textButton} onClick={handlePasswordReset} disabled={busy}>Reset password</button>
          </form>
          {message && (
            <p className={styles.message} role="alert">
              {message}
            </p>
          )}
        </div>
        <div className={styles.authAside}>
          <span>01 / CONTENT WORKSPACE</span>
          <h2>Make the work visible.</h2>
          <p>
            One quiet place to shape the ventures, services, and stories that
            make up the ecosystem.
          </p>
        </div>
      </main>
    );

  return (
    <main className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}></span>
          <span>
            SONKAR
            <br />
            <small>CONTENT STUDIO</small>
          </span>
        </div>
        <nav>
          <p className={styles.navLabel}>Manage</p>
          <button
            className={type === "ventures" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("ventures");
              resetForm();
            }}
          >
            <LayoutDashboard size={17} /> Ventures{" "}
            <span>{type === "ventures" ? "•" : ""}</span>
          </button>
          <button
            className={type === "services" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("services");
              resetForm();
            }}
          >
            <ArrowUpRight size={17} /> Services{" "}
            <span>{type === "services" ? "•" : ""}</span>
          </button>
          <button
            className={type === "contact" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("contact");
              resetForm();
            }}
          >
            <Mail size={17} /> Contact details{" "}
            <span>{type === "contact" ? "•" : ""}</span>
          </button>
          <button
            className={type === "account" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("account");
              resetForm();
            }}
          >
            <KeyRound size={17} /> Admin credentials
            <span>{type === "account" ? "•" : ""}</span>
          </button>
          <button
            className={type === "access" ? styles.navActive : styles.navItem}
            onClick={() => {
              setType("access");
              resetForm();
            }}
          >
            <UsersRound size={17} /> Admin access
            <span>{type === "access" ? "•" : ""}</span>
          </button>
        </nav>
        <div className={styles.sidebarFoot}>
          <span className={styles.userDot} />
          {user.email}
          <button
            title="Sign out"
            onClick={() => signOut().then(() => setUser(null))}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>
              CONTENT WORKSPACE / {type.toUpperCase()}
            </p>
            <h1>{type === "ventures" ? "Ventures" : type === "services" ? "Services" : type === "contact" ? "Contact details" : type === "account" ? "Admin credentials" : "Admin access"}</h1>
          </div>
          <span className={styles.liveBadge}>
            <span /> Live database
          </span>
        </header>
        <div className={styles.contentGrid}>
          {type === "access" ? (
            <section className={styles.editor}>
              <div className={styles.sectionHeading}>
                <div><p className={styles.kicker}>DATABASE-BACKED ACCESS LIST</p><h2>Admin access</h2></div>
              </div>
              <form onSubmit={handleAdminAccessSubmit} className={styles.form}>
                <label>
                  Email address
                  <input type="email" required value={newAdminEmail} placeholder="admin@example.com" onChange={(event) => setNewAdminEmail(event.target.value)} />
                </label>
                <label>
                  Temporary password <small>Optional for an existing Supabase user.</small>
                  <input type="password" minLength="8" value={newAdminPassword} placeholder="Create a new admin account" onChange={(event) => setNewAdminPassword(event.target.value)} />
                </label>
                <p className={styles.authIntro}>Add an existing user with their email alone, or enter a temporary password to create a new Supabase Auth account and grant access in one step.</p>
                <div className={styles.formActions}>
                  <button className={styles.primaryButton} disabled={busy}>{busy ? "Saving..." : "Grant access"} <ArrowUpRight size={17} /></button>
                </div>
              </form>
              <div className={styles.itemList}>
                {adminAccess.map((admin) => (
                  <article className={styles.item} key={admin.email}>
                    <div className={styles.itemImage}><UsersRound size={18} /></div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemTitle}>
                        <h3>{admin.email}</h3>
                        <span className={admin.is_active ? styles.statusLive : styles.statusHidden}>{admin.is_active ? "Active" : "Revoked"}</span>
                      </div>
                      {!admin.is_active && <small>Access revoked{admin.revoked_at ? ` on ${new Date(admin.revoked_at).toLocaleString()}` : ""}.</small>}
                    </div>
                    <div className={styles.itemActions}>
                      <button type="button" onClick={() => handleAdminAccessChange(admin.email, !admin.is_active)} disabled={busy || (!admin.is_active ? false : user?.email?.toLowerCase() === admin.email.toLowerCase())} title={admin.is_active && user?.email?.toLowerCase() === admin.email.toLowerCase() ? "You cannot revoke your own access" : admin.is_active ? "Revoke access" : "Restore access"}>
                        {admin.is_active ? "Revoke" : "Restore"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {message && <p className={styles.message} role="status">{message}</p>}
            </section>
          ) : type === "account" ? (
            <section className={styles.editor}>
              <div className={styles.sectionHeading}>
                <div><p className={styles.kicker}>SUPABASE AUTH ACCOUNT</p><h2>Update sign-in details</h2></div>
              </div>
              <form onSubmit={handleAccountSubmit} className={styles.form}>
                <label>
                  Email address
                  <input type="email" required value={accountSettings.email} onChange={(event) => setAccountSettings({ ...accountSettings, email: event.target.value })} />
                </label>
                <label>
                  New password <small>Leave blank to keep the current password.</small>
                  <input type="password" minLength="8" value={accountSettings.password} onChange={(event) => setAccountSettings({ ...accountSettings, password: event.target.value })} />
                </label>
                <label>
                  Confirm new password
                  <input type="password" minLength="8" value={accountSettings.confirmPassword} onChange={(event) => setAccountSettings({ ...accountSettings, confirmPassword: event.target.value })} />
                </label>
                <div className={styles.formActions}>
                  <button className={styles.primaryButton} disabled={busy}>{busy ? "Saving..." : "Save credentials"} <ArrowUpRight size={17} /></button>
                </div>
                {message && <p className={styles.message} role="status">{message}</p>}
              </form>
            </section>
          ) : type === "contact" ? (
            <section className={styles.editor}>
              <div className={styles.sectionHeading}>
                <div><p className={styles.kicker}>PUBLIC FOOTER AND FORM RECIPIENT</p><h2>Contact details</h2></div>
              </div>
              {contactSettings && (
                <form onSubmit={handleContactSubmit} className={styles.form}>
                  {[
                    ["primary_email", "Admin email", "hello@example.com", "email"],
                    ["primary_whatsapp", "WhatsApp number", "+91 98765 43210", "tel"],
                    ["linkedin_url", "LinkedIn URL", "https://linkedin.com/in/...", "url"],
                    ["instagram_url", "Instagram URL", "https://instagram.com/...", "url"],
                    ["twitter_url", "Twitter / X URL", "https://twitter.com/...", "url"],
                    ["location", "Location", "Bangalore, Karnataka, India", "text"],
                  ].map(([key, label, placeholder, inputType]) => (
                    <label key={key}>
                      {label}
                      <input type={inputType} value={contactSettings[key] || ""} placeholder={placeholder} onChange={(event) => setContactSettings({ ...contactSettings, [key]: event.target.value })} />
                    </label>
                  ))}
                  <div className={styles.formActions}>
                    <button className={styles.primaryButton} disabled={busy}>{busy ? "Saving..." : "Save contact details"} <ArrowUpRight size={17} /></button>
                  </div>
                  {message && <p className={styles.message} role="status">{message}</p>}
                </form>
              )}
            </section>
          ) : (
          <section className={styles.editor}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>
                  {form.id ? "EDITING ITEM" : "NEW ITEM"}
                </p>
                <h2>
                  {form.id
                    ? form.name
                    : `Add a ${type === "ventures" ? "venture" : "service"}`}
                </h2>
              </div>
              {form.id && (
                <button
                  className={styles.iconButton}
                  onClick={resetForm}
                  title="Close editor"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Impactshaala"
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  rows="5"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: limitWords(event.target.value) })}
                  placeholder="Describe this item..."
                />
                <small>{descriptionWords}/{DESCRIPTION_WORD_LIMIT} words</small>
              </label>
              <label>
                Detail-page image
                <input
                  value={form.detail_image_url || ""}
                  onChange={(event) =>
                    setForm({ ...form, detail_image_url: event.target.value })
                  }
                  placeholder="Shown beside this item's description"
                />
              </label>
              <label className={styles.uploadBox}>
                <ImagePlus size={21} />
                <span>
                  <strong>Upload detail-page image</strong>
                  <small>Shown on the {type === "ventures" ? "ventures" : "services"} page</small>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImage(event, "detail_image_url")}
                  disabled={busy}
                />
              </label>
              {form.detail_image_url && (
                <img
                  className={styles.preview}
                  src={getImageUrl(form.detail_image_url)}
                  alt="Detail-page preview"
                />
              )}
              <label>
                Landing-page rotating-scroll image
                <input
                  value={form.landing_image_url || ""}
                  onChange={(event) => setForm({ ...form, landing_image_url: event.target.value })}
                  placeholder="Shown in the home page rotating portfolio"
                />
              </label>
              <label className={styles.uploadBox}>
                <ImagePlus size={21} />
                <span>
                  <strong>Upload landing-page image</strong>
                  <small>Shown in the rotating portfolio on the landing page</small>
                </span>
                <input type="file" accept="image/*" onChange={(event) => handleImage(event, "landing_image_url")} disabled={busy} />
              </label>
              {form.landing_image_url && <img className={styles.preview} src={getImageUrl(form.landing_image_url)} alt="Landing-page preview" />}
              {type === "ventures" && (
                <label>
                  Website URL
                  <input
                    value={form.website_url || ""}
                    onChange={(event) =>
                      setForm({ ...form, website_url: event.target.value })
                    }
                    placeholder="https://..."
                  />
                </label>
              )}
              <div className={styles.formRow}>
                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(event) =>
                      setForm({ ...form, display_order: event.target.value })
                    }
                  />
                </label>
                <label className={styles.switchLabel}>
                  Visible on site
                  <input
                    className={styles.switch}
                    type="checkbox"
                    checked={form.is_live !== false}
                    onChange={(event) =>
                      setForm({ ...form, is_live: event.target.checked })
                    }
                  />
                </label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.primaryButton} disabled={busy}>
                  {busy
                    ? "Saving..."
                    : form.id
                      ? "Update item"
                      : "Publish item"}{" "}
                  <ArrowUpRight size={17} />
                </button>
                {form.id && (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {message && (
                <p className={styles.message} role="status">
                  {message}
                </p>
              )}
            </form>
          </section>
          )}
          {(type === "ventures" || type === "services") && <section className={styles.library}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>DATABASE RECORDS</p>
                <h2>
                  {items.length} {type}
                </h2>
              </div>
              <button className={styles.addButton} onClick={resetForm}>
                <Plus size={17} /> New
              </button>
            </div>
            <div className={styles.itemList}>
              {items.map((item) => (
                <article className={styles.item} key={item.id}>
                  <div className={styles.itemImage}>
                    {item.detail_image_url || item.image_url ? (
                      <img src={getImageUrl(item.detail_image_url || item.image_url)} alt="" />
                    ) : (
                      <ImagePlus size={18} />
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemTitle}>
                      <h3>{item.name}</h3>
                      <span
                        className={
                          item.is_active
                            ? styles.statusLive
                            : styles.statusHidden
                        }
                      >
                        {item.is_active ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <small>Order {item.display_order ?? 0}</small>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => editItem(item)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>}
        </div>
      </section>
    </main>
  );
}
