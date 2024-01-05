import { marked } from 'marked';

const Markdown = (props: { content: string }) => {
  const html = marked(props.content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
export default Markdown;
