import React from 'react';
import { TextInput, TextArea, Button } from './FormFields';
import { FAQItem } from '@/lib/database';

interface LLMSectionEditorProps {
  llmContent: any;
  updateNestedField: (section: string, index: number | null, field: string, value: any) => void;
  countWords: (text: string) => number;
  getWordStatus: (words: number, min?: number, max?: number) => { status: string; color: string; bg: string };
}

export const LLMSectionEditor: React.FC<LLMSectionEditorProps> = ({
  llmContent,
  updateNestedField,
  countWords,
  getWordStatus
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-lg mb-2">LLM Optimization Settings</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">🎯 LLM Citation Priority List</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Expert quote (+41% citation lift)</li>
          <li>2. Dated stat (+30% citation boost)</li>
          <li>3. FAQ/HowTo schema (Copilot reads verbatim)</li>
          <li>4. Answer box under H1 (40-70 words)</li>
          <li>5. Fresh "Updated" timestamp</li>
          <li>6. Community echo on Reddit (~47% of Perplexity answers)</li>
        </ul>
      </div>
    </div>

    {/* Answer Box Section */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium mb-3">📝 Answer Box (Feature Snippet)</h4>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">40-70 Word Summary</label>
          <div className="flex items-center gap-2">
            {(() => {
              const text = llmContent?.answerBox || '';
              const words = countWords(text);
              const status = getWordStatus(words);
              return (
                <span className={`px-2 py-1 rounded text-xs ${status.bg} ${status.color}`}>
                  {words} words
                </span>
              );
            })()}
          </div>
        </div>
        <textarea
          value={llmContent?.answerBox || ''}
          onChange={(e) => updateNestedField('llm', null, 'answerBox', e.target.value)}
          className="w-full p-3 border border-border rounded-lg h-24 text-sm"
          placeholder="Write a 40-70 word summary that answers the main question about your product..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Optimal for LLM feature snippets. Keep between 40-70 words for maximum citation potential.
        </p>
      </div>
    </div>

    {/* Expert Quote Section */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium mb-3">👨‍🎓 Expert Quote (+41% Citation Lift)</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Quote</label>
          <textarea
            value={llmContent?.expertQuote?.quote || ''}
            onChange={(e) => {
              const currentQuote = llmContent?.expertQuote || {};
              updateNestedField('llm', null, 'expertQuote', { ...currentQuote, quote: e.target.value });
            }}
            className="w-full p-2 border border-border rounded text-sm h-20"
            placeholder="Expert opinion or insight about your industry/product..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Expert Name"
            value={llmContent?.expertQuote?.expertName || ''}
            onChange={(value) => {
              const currentQuote = llmContent?.expertQuote || {};
              updateNestedField('llm', null, 'expertQuote', { ...currentQuote, expertName: value });
            }}
            placeholder="Dr. Jane Smith"
          />
          <TextInput
            label="Title"
            value={llmContent?.expertQuote?.expertTitle || ''}
            onChange={(value) => {
              const currentQuote = llmContent?.expertQuote || {};
              updateNestedField('llm', null, 'expertQuote', { ...currentQuote, expertTitle: value });
            }}
            placeholder="Director of Design Technology"
          />
        </div>
        <TextInput
          label="Institution"
          value={llmContent?.expertQuote?.institution || ''}
          onChange={(value) => {
            const currentQuote = llmContent?.expertQuote || {};
            updateNestedField('llm', null, 'expertQuote', { ...currentQuote, institution: value });
          }}
          placeholder="Stanford University, MIT, etc."
        />
      </div>
    </div>

    {/* Statistics Section */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium mb-3">📊 Fresh Statistics (+30% Citation Boost)</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Statistic"
            value={llmContent?.statistic?.statistic || ''}
            onChange={(value) => {
              const currentStat = llmContent?.statistic || {};
              updateNestedField('llm', null, 'statistic', { ...currentStat, statistic: value });
            }}
            placeholder="73%, 2.5x, $1.2M, etc."
          />
          <TextInput
            label="Date"
            value={llmContent?.statistic?.date || ''}
            onChange={(value) => {
              const currentStat = llmContent?.statistic || {};
              updateNestedField('llm', null, 'statistic', { ...currentStat, date: value });
            }}
            placeholder="January 2024"
          />
        </div>
        <TextArea
          label="Description"
          value={llmContent?.statistic?.description || ''}
          onChange={(value) => {
            const currentStat = llmContent?.statistic || {};
            updateNestedField('llm', null, 'statistic', { ...currentStat, description: value });
          }}
          placeholder="of design teams report improved workflow efficiency..."
          rows={2}
        />
        <TextInput
          label="Source"
          value={llmContent?.statistic?.source || ''}
          onChange={(value) => {
            const currentStat = llmContent?.statistic || {};
            updateNestedField('llm', null, 'statistic', { ...currentStat, source: value });
          }}
          placeholder="Design Systems Survey 2024, McKinsey Report, etc."
        />
      </div>
    </div>

    {/* FAQ Section */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium mb-3">❓ FAQ Schema (Copilot Reads Verbatim)</h4>
      <div className="space-y-4">
        {(llmContent?.faqs || []).map((faq: FAQItem, index: number) => {
          const stableKey = `llm-faq-${index}-${faq.question?.length || 0}-${faq.answer?.length || 0}`;
          return (
          <div key={stableKey} className="border border-gray-100 rounded p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">FAQ #{index + 1}</span>
              <button
                onClick={() => {
                  const currentFaqs = llmContent?.faqs || [];
                  const updatedFaqs = currentFaqs.filter((_: any, i: number) => i !== index);
                  updateNestedField('llm', null, 'faqs', updatedFaqs);
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              <TextInput
                label="Question"
                value={faq.question}
                onChange={(value) => {
                  const currentFaqs = [...(llmContent?.faqs || [])];
                  currentFaqs[index] = { ...currentFaqs[index], question: value };
                  updateNestedField('llm', null, 'faqs', currentFaqs);
                }}
                placeholder="How does..."
              />
              <TextArea
                label="Answer"
                value={faq.answer}
                onChange={(value) => {
                  const currentFaqs = [...(llmContent?.faqs || [])];
                  currentFaqs[index] = { ...currentFaqs[index], answer: value };
                  updateNestedField('llm', null, 'faqs', currentFaqs);
                }}
                placeholder="Our platform..."
                rows={2}
              />
            </div>
          </div>
          )
        })}
        <button
          onClick={() => {
            const currentFaqs = llmContent?.faqs || [];
            const newFaq = { question: '', answer: '' };
            updateNestedField('llm', null, 'faqs', [...currentFaqs, newFaq]);
          }}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          + Add FAQ Item
        </button>
      </div>
    </div>

    {/* Content Optimization Tips */}
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium mb-3">💡 Content Optimization Tips</h4>
      <ul className="text-sm space-y-2">
        <li>• Keep paragraphs ≤ 300 tokens (~1200 characters)</li>
        <li>• Break with H2 every ~250 words for vector chunks</li>
        <li>• Avoid hard-sell CTAs in quotable content</li>
        <li>• Include updated timestamps on all content</li>
        <li>• Seed Reddit/Stack Overflow discussions for community echo</li>
      </ul>
    </div>
  </div>
);