import React from 'react';

interface ProductsManagerProps {
  products: Record<string, any>;
  activeSection: string;
  showNewProductForm: boolean;
  newProductSlug: string;
  newProductTitle: string;
  setActiveSection: (key: string) => void;
  setShowNewProductForm: (v: boolean) => void;
  setNewProductSlug: (v: string) => void;
  setNewProductTitle: (v: string) => void;
  onDuplicate: (productKey: string) => void;
  onDelete: (productKey: string) => void;
  onCreate: () => void;
  onRenameSlug?: (productKey: string, next: string) => void;
  onRenameTitle?: (productKey: string, next: string) => void;
  onMove?: (productKey: string, direction: 'up' | 'down') => void;
  onImportJson?: (productKey: string, data: any) => void;
  onCreateFromJson?: (slug: string, data: any) => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  activeSection,
  showNewProductForm,
  newProductSlug,
  newProductTitle,
  setActiveSection,
  setShowNewProductForm,
  setNewProductSlug,
  setNewProductTitle,
  onDuplicate,
  onDelete,
  onCreate,
  onRenameSlug,
  onRenameTitle,
  onMove,
  onImportJson,
  onCreateFromJson,
}) => {
  const productKeys = Object.keys(products || {});
  const [openActionsFor, setOpenActionsFor] = React.useState<string | null>(null);
  const [editingSlugFor, setEditingSlugFor] = React.useState<string | null>(null);
  const [editingTitleFor, setEditingTitleFor] = React.useState<string | null>(null);
  const [slugDraft, setSlugDraft] = React.useState<string>('');
  const [titleDraft, setTitleDraft] = React.useState<string>('');
  const [showPasteFor, setShowPasteFor] = React.useState<string | null>(null);
  const [pasteText, setPasteText] = React.useState<string>('');
  const [createFromJsonOpen, setCreateFromJsonOpen] = React.useState<boolean>(false);
  const [createJsonText, setCreateJsonText] = React.useState<string>('');

  const isFirst = (key: string) => productKeys.indexOf(key) === 0;
  const isLast = (key: string) => productKeys.indexOf(key) === productKeys.length - 1;
  return (
    <div>
      {productKeys.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2 text-sm">Product Pages</h4>
          <div className="space-y-2">
            {productKeys.map((productKey) => {
              const isActive = activeSection === `product-${productKey}`;
              const title = products[productKey]?.title || productKey.replace(/-/g, ' ');
              return (
                <div key={productKey} className={`p-2 rounded border ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border'} focus-within:ring-1 focus-within:ring-primary`}>
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      className="text-left flex-1"
                      onClick={() => setActiveSection(`product-${productKey}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSection(`product-${productKey}`);
                        }
                      }}
                    >
                      <div className="font-medium">{title}</div>
                      <div className="opacity-70 text-xs">/{productKey}</div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded bg-muted"
                        onClick={() => setOpenActionsFor(openActionsFor === productKey ? null : productKey)}
                        aria-haspopup="true"
                        aria-expanded={openActionsFor === productKey}
                        aria-controls={`product-actions-${productKey}`}
                      >
                        Manage
                      </button>
                    </div>
                  </div>

                  {openActionsFor === productKey && (
                    <div id={`product-actions-${productKey}`} role="group" className="mt-2 bg-muted/30 rounded p-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-muted"
                          onClick={() => { onDuplicate(productKey); setOpenActionsFor(null); }}
                        >
                          Duplicate
                        </button>
                        {onMove && (
                          <>
                            <button
                              type="button"
                              className="text-xs px-2 py-1 rounded bg-muted disabled:opacity-50"
                              disabled={isFirst(productKey)}
                              onClick={() => { onMove(productKey, 'up'); }}
                              aria-label="Move up"
                            >
                              Move ↑
                            </button>
                            <button
                              type="button"
                              className="text-xs px-2 py-1 rounded bg-muted disabled:opacity-50"
                              disabled={isLast(productKey)}
                              onClick={() => { onMove(productKey, 'down'); }}
                              aria-label="Move down"
                            >
                              Move ↓
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-muted"
                          onClick={() => {
                            setEditingTitleFor(null);
                            setEditingSlugFor(productKey);
                            setSlugDraft(productKey);
                          }}
                        >
                          Rename Slug
                        </button>
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-muted"
                          onClick={() => {
                            setEditingSlugFor(null);
                            setEditingTitleFor(productKey);
                            setTitleDraft(products[productKey]?.title || '');
                          }}
                        >
                          Rename Title
                        </button>
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-muted text-red-700"
                          onClick={() => {
                            if (confirm('Delete this product page? This only affects local JSON until you Publish.')) {
                              onDelete(productKey);
                              setOpenActionsFor(null);
                            }
                          }}
                        >
                          Delete
                        </button>
                        {onImportJson && (
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-muted"
                            onClick={() => { setShowPasteFor(productKey); setPasteText(JSON.stringify(products[productKey] || {}, null, 2)); }}
                          >
                            Paste Full JSON
                          </button>
                        )}
                      </div>

                      {editingSlugFor === productKey && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={slugDraft}
                            onChange={(e) => setSlugDraft(e.target.value)}
                            className="flex-1 p-1 border border-border rounded text-xs"
                            placeholder="new-slug"
                            aria-label="New slug"
                          />
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                            onClick={() => {
                              if (onRenameSlug) onRenameSlug(productKey, slugDraft);
                              setEditingSlugFor(null);
                              setOpenActionsFor(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-muted"
                            onClick={() => setEditingSlugFor(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {editingTitleFor === productKey && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={titleDraft}
                            onChange={(e) => setTitleDraft(e.target.value)}
                            className="flex-1 p-1 border border-border rounded text-xs"
                            placeholder="New title"
                            aria-label="New title"
                          />
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                            onClick={() => {
                              if (onRenameTitle) onRenameTitle(productKey, titleDraft);
                              setEditingTitleFor(null);
                              setOpenActionsFor(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-muted"
                            onClick={() => setEditingTitleFor(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {showPasteFor === productKey && (
                        <div className="space-y-2">
                          <textarea
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            className="w-full p-2 border border-border rounded text-xs font-mono h-40"
                            placeholder='{"title":"My Product","description":"...","primaryButton":"Get Started","primaryButtonLink":"/start","secondaryButton":"Learn More","secondaryButtonLink":"/learn","details":[{"title":"","description":""}],"benefits":[],"specifications":[],"pricing":{"price":"","period":"/month","description":"","buttonText":""},"visibility":{"waitlist":true},"llm":{"answerBox":"","expertQuote":{},"statistic":{},"faqs":[]}}'
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                              onClick={() => {
                                try {
                                  const parsed = JSON.parse(pasteText);
                                  onImportJson?.(productKey, parsed);
                                  setShowPasteFor(null);
                                  setPasteText('');
                                  setOpenActionsFor(null);
                                } catch {
                                  alert('Invalid JSON. Please fix and try again.');
                                }
                              }}
                            >
                              Apply JSON
                            </button>
                            <button
                              type="button"
                              className="text-xs px-2 py-1 rounded bg-muted"
                              onClick={() => { setShowPasteFor(null); setPasteText(''); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3">
        {!showNewProductForm ? (
          <button onClick={() => setShowNewProductForm(true)} className="w-full button-secondary text-xs">
            + New Product Page
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newProductSlug}
              onChange={(e) => setNewProductSlug(e.target.value)}
              placeholder="my-product"
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="text"
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
              placeholder="My Product"
              className="w-full p-2 border rounded text-sm"
            />
            <div className="flex gap-2">
              <button onClick={onCreate} className="button text-xs">Create</button>
              <button
                onClick={() => {
                  setShowNewProductForm(false);
                  setNewProductSlug('');
                  setNewProductTitle('');
                }}
                className="button-secondary text-xs"
              >
                Cancel
              </button>
            </div>
            {onCreateFromJson && (
              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  className="w-full text-xs px-2 py-1 rounded bg-muted"
                  onClick={() => setCreateFromJsonOpen(!createFromJsonOpen)}
                >
                  {createFromJsonOpen ? 'Hide JSON Creator' : 'Create from Full JSON'}
                </button>
                {createFromJsonOpen && (
                  <div className="space-y-2">
                    <textarea
                      value={createJsonText}
                      onChange={(e) => setCreateJsonText(e.target.value)}
                      className="w-full p-2 border border-border rounded text-xs font-mono h-40"
                      placeholder='{"title":"My Product","description":"...","primaryButton":"Get Started","primaryButtonLink":"/start","secondaryButton":"Learn More","secondaryButtonLink":"/learn","details":[{"title":"","description":""}],"benefits":[],"specifications":[],"pricing":{"price":"","period":"/month","description":"","buttonText":""},"visibility":{"waitlist":true},"llm":{"answerBox":"","expertQuote":{},"statistic":{},"faqs":[]}}'
                    />
                    <button
                      type="button"
                      className="button text-xs"
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(createJsonText || '{}');
                          const slug = newProductSlug || (parsed?.slug as string) || '';
                          if (!slug && !parsed?.title) {
                            alert('Provide a slug above or include a title/slug in JSON.');
                            return;
                          }
                          onCreateFromJson?.(slug, parsed);
                          setCreateJsonText('');
                          setCreateFromJsonOpen(false);
                        } catch {
                          alert('Invalid JSON. Please fix and try again.');
                        }
                      }}
                    >
                      Create from JSON
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


