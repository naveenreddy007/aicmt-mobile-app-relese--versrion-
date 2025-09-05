import { getQuotationHistory } from "@/app/actions/quotation-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineTitle, TimelineIcon, TimelineDescription } from "@/components/ui/timeline";
import { FileText, Mail } from "lucide-react";

export async function QuotationHistory({ customOrderId }: { customOrderId: string }) {
  const history = await getQuotationHistory(customOrderId);

  if (!history || history.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No quotation history found.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation History</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline>
          {history.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon>
                  {item.status === "created" ? <FileText className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </TimelineIcon>
                <TimelineTitle>{item.status}</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>
                <p>{item.notes}</p>
                <time className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </time>
              </TimelineDescription>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}