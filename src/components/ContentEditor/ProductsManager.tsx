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
}) => {
  const productKeys = Object.keys(products || {});
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
                <div
                  key={productKey}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setActiveSection(`product-${productKey}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveSection(`product-${productKey}`);
                    }
                  }}
                  className={`w-full text-left p-2 rounded text-sm transition-colors flex items-center justify-between ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/40'
                  }`}
                >
                  <span>
                    <span className="font-medium">{title}</span>
                    <span className="opacity-70 ml-2">/{productKey}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded ${isActive ? 'bg-white/20' : 'bg-muted'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(productKey);
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded ${isActive ? 'bg-white/20' : 'bg-muted'} text-red-700`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this product page? This only affects local JSON until you Publish.')) {
                          onDelete(productKey);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </span>
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
          </div>
        )}
      </div>
    </div>
  );
};


