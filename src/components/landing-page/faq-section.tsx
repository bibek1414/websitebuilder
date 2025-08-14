import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question: "How quickly can I build my website?",
      answer:
        "With our AI-powered platform, you can have a fully functional website ready in as little as 5 minutes. Choose a template, customize it with your content, and launch!",
    },
    {
      question: "Do I need coding skills to use Nepdora?",
      answer:
        "Not at all! Our drag-and-drop builder is designed for everyone. No coding knowledge required. Everything is visual and intuitive.",
    },
    {
      question: "Can I use my own domain name?",
      answer:
        "Yes! You can connect your existing domain or register a new one directly through our platform. We also provide free SSL certificates.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers. For enterprise customers, we also offer invoice-based billing.",
    },
    {
      question: "Is there a free plan available?",
      answer:
        "Yes! Our Starter plan is completely free forever and includes 1 website, basic templates, and essential features to get you started.",
    },
    {
      question: "Can I migrate my existing website?",
      answer:
        "Absolutely! Our team can help you migrate your existing website content. For complex migrations, we offer white-glove migration services.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <MessageSquare className="mr-2 h-4 w-4" />
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Frequently Asked
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Nepdora
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button
            variant="outline"
            className="hover:bg-primary hover:text-white transition-colors"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
