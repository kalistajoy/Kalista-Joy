# Twenty CRM Notifications Prototype

A high-fidelity B2B CRM exploration focusing on inbox-driven workflows. This React-based prototype demonstrates how users can manage approvals, respond to emails, and execute complex workflows within a unified, system-native interface powered by the Gemini API.

![Project Preview](https://via.placeholder.com/1200x600?text=Twenty+CRM+Prototype)

## 🚀 Features

*   **Inbox-Driven Architecture**: A sliding inbox overlay that functions as a decision surface, allowing users to process tasks without losing context of their primary view.
*   **Interactive Workflow Panel**: A dedicated right-side panel for structured inputs, approval flows, and visualizing workflow steps (Trigger → Email → Approval).
*   **Smart Context**: Automatically surfaces relevant email threads, record details, and "Assignee" status based on the selected notification.
*   **AI Summaries**: (Conceptual) Leverages the Gemini API to summarize complex email threads and generate draft responses for review.
*   **Success Animations**: Smooth, optimistic UI updates and persistent feedback banners (e.g., "Review Request Sent") with undo capabilities.
*   **System-Native Design**: Built with a focus on consistent typography, spacing, and component reusability matching the Twenty CRM aesthetic.

## 🛠️ Tech Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Language**: TypeScript
*   **Deployment**: Vercel

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/twenty-crm-prototype.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎨 Design Philosophy

This project explores the concept of the Inbox not just as a feed, but as a **workflow engine**. 

- **Action > Information**: Notifications are designed to drive specific actions (Approve, Reply, Review).
- **Context Preservation**: The UI utilizes split panes and sliding overlays to keep the user grounded in their workspace while tackling tasks.
- **Visual Feedback**: Every state change (e.g., submitting a review) is accompanied by immediate visual confirmation.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
